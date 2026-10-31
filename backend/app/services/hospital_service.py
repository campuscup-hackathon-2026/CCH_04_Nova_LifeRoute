"""
Hospital recommendation service.

Ranking criteria:
1. Hospital must be active and verified
2. Distance / ETA from patient pickup to hospital
3. Available beds (general + ICU when required)
4. Service match (e.g., cardiac care, trauma)

[DECISION SUPPORT ONLY] Not a clinically validated triage system.
"""
from __future__ import annotations

from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.database import models
from app.services.eta_service import compute_eta_seconds
from app.utils.geo_utils import haversine_km


def recommend_hospitals(
    db: Session,
    request: models.EmergencyRequest,
    required_service: Optional[str] = None,
    need_icu: bool = False,
    top_n: int = 5,
) -> List[models.HospitalRecommendation]:
    """
    Returns a ranked list of hospital recommendations saved to the DB.

    Scoring (0.0–1.0, higher = better):
        50% ETA score (inverse of travel time)
        30% bed availability score
        20% service match bonus
    """
    hospitals = (
        db.query(models.Hospital)
        .filter(models.Hospital.is_active == True)
        .all()
    )

    p_lat = float(request.patient_latitude)
    p_lon = float(request.patient_longitude)

    candidates = []
    for h in hospitals:
        h_lat = float(h.latitude)
        h_lon = float(h.longitude)
        dist_km = haversine_km(p_lat, p_lon, h_lat, h_lon)
        eta_sec = compute_eta_seconds(dist_km, traffic_factor=1.1, base_speed_kmh=50.0)

        # Skip if no beds
        if need_icu and h.available_icu_beds <= 0:
            continue
        if not need_icu and h.available_beds <= 0:
            continue

        # ETA score: full score at 5 min, 0 at 60 min
        eta_min = eta_sec / 60
        eta_score = max(0.0, 1.0 - eta_min / 60.0)

        # Bed score
        total = max(h.total_beds, 1)
        bed_score = min(1.0, h.available_beds / total)

        # Service match
        service_bonus = 0.0
        if required_service:
            svc_names = [s.service_name.lower() for s in h.services if s.is_available]
            if required_service.lower() in " ".join(svc_names):
                service_bonus = 1.0

        score = 0.5 * eta_score + 0.3 * bed_score + 0.2 * service_bonus
        candidates.append((h, score, eta_sec, dist_km))

    # Sort descending by score
    candidates.sort(key=lambda x: x[1], reverse=True)
    top = candidates[:top_n]

    # Delete previous recommendations for this request
    db.query(models.HospitalRecommendation).filter(
        models.HospitalRecommendation.request_id == request.request_id
    ).delete()

    recommendations = []
    for rank, (h, score, eta_sec, dist_km) in enumerate(top, start=1):
        rec = models.HospitalRecommendation(
            request_id=request.request_id,
            hospital_id=h.hospital_id,
            rank=rank,
            score=round(score, 4),
            estimated_travel_seconds=int(eta_sec),
            reason=(
                f"Rank {rank}: ETA ~{int(eta_sec/60)} min, "
                f"{h.available_beds} beds available"
                + (f", service match: {required_service}" if required_service and score > 0.7 else "")
            ),
            is_selected=(rank == 1),
        )
        db.add(rec)
        recommendations.append(rec)

    db.commit()
    for r in recommendations:
        db.refresh(r)
    return recommendations


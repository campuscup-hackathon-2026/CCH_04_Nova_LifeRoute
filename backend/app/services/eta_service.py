"""
ETA prediction service.

Primary method: physics-based formula (distance / effective_speed).
Optional: scikit-learn linear regression model trained on historical ETA_PREDICTIONS.

[SIMULATION NOTE] Traffic factor is simulated.
"""
from __future__ import annotations

from typing import Optional
import math

from sqlalchemy.orm import Session

from app.database import models
from app.utils.geo_utils import haversine_km


def compute_eta_seconds(
    distance_km: float,
    traffic_factor: float = 1.0,
    base_speed_kmh: float = 60.0,
) -> int:
    """
    ETA = (distance_km / effective_speed_kmh) * 3600 seconds.
    traffic_factor > 1 means slower traffic (e.g. 1.3 → 30% slower).
    """
    effective_speed = base_speed_kmh / max(traffic_factor, 0.1)
    return max(30, int((distance_km / max(effective_speed, 1.0)) * 3600))


def get_traffic_factor(db: Session, edge_id: Optional[int] = None) -> float:
    """
    Return the current traffic factor for an edge.
    If no active incident, factor = 1.0 (free flow).
    [SIMULATION] Values are simulated.
    """
    if edge_id is None:
        return 1.0
    incident = (
        db.query(models.TrafficIncident)
        .filter(
            models.TrafficIncident.edge_id == edge_id,
            models.TrafficIncident.is_active == True,
        )
        .first()
    )
    if not incident:
        return 1.0
    if incident.is_road_closed:
        return 99.0   # effectively impassable
    reduction = float(incident.speed_reduction_pct or 0) / 100.0
    return 1.0 + reduction   # e.g. 30% reduction → factor 1.3


def estimate_ambulance_eta(
    db: Session,
    ambulance: models.Ambulance,
    patient_lat: float,
    patient_lon: float,
) -> int:
    """
    Estimate ETA in seconds from ambulance's current location to patient.
    Uses Haversine distance + simulated traffic factor.
    """
    if ambulance.current_latitude is None or ambulance.current_longitude is None:
        return 600   # default 10 min if no location
    dist_km = haversine_km(
        float(ambulance.current_latitude), float(ambulance.current_longitude),
        patient_lat, patient_lon,
    )
    factor = 1.1   # slight urban traffic penalty (simulated)
    return compute_eta_seconds(dist_km, traffic_factor=factor, base_speed_kmh=50.0)


def save_eta_prediction(
    db: Session,
    trip_id: Optional[int],
    ambulance_id: Optional[int],
    predicted_seconds: int,
    distance_km: float,
    traffic_factor: float = 1.0,
    is_ml: bool = False,
) -> models.ETAPrediction:
    pred = models.ETAPrediction(
        trip_id=trip_id,
        ambulance_id=ambulance_id,
        predicted_seconds=predicted_seconds,
        distance_km=distance_km,
        traffic_factor=traffic_factor,
        model_version="formula_v1" if not is_ml else "sklearn_v1",
        is_ml_prediction=is_ml,
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred


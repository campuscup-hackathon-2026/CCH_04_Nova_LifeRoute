"""
Dispatch service — selects the best available ambulance for an emergency.

Selection algorithm:
1. Filter ambulances where is_available=True and status='available'
2. Rank by estimated travel time (ETA) to patient location
3. Assign the ambulance with the shortest ETA
4. Update ambulance status and create a DispatchAssignment record

[SIMULATION NOTE] Ambulance locations may be simulated.
"""
from __future__ import annotations

from typing import Optional, List
from datetime import datetime

from sqlalchemy.orm import Session

from app.database import models
from app.services.eta_service import estimate_ambulance_eta
from app.utils.geo_utils import haversine_km


def find_available_ambulances(db: Session) -> List[models.Ambulance]:
    return (
        db.query(models.Ambulance)
        .filter(
            models.Ambulance.is_available == True,
            models.Ambulance.status == "available",
        )
        .all()
    )


def rank_ambulances_by_eta(
    db: Session,
    ambulances: List[models.Ambulance],
    patient_lat: float,
    patient_lon: float,
) -> List[tuple[models.Ambulance, int]]:
    """
    Returns list of (ambulance, eta_seconds) sorted by ETA ascending.
    """
    ranked = []
    for amb in ambulances:
        eta = estimate_ambulance_eta(db, amb, patient_lat, patient_lon)
        ranked.append((amb, eta))
    ranked.sort(key=lambda x: x[1])
    return ranked


def dispatch_ambulance(
    db: Session,
    request: models.EmergencyRequest,
) -> Optional[models.DispatchAssignment]:
    """
    Main dispatch function:
    1. Find available ambulances
    2. Rank by ETA
    3. Assign best ambulance
    4. Lock and update ambulance status
    5. Create DispatchAssignment
    """
    available = find_available_ambulances(db)
    if not available:
        return None   # No ambulances available

    patient_lat = float(request.patient_latitude)
    patient_lon = float(request.patient_longitude)

    ranked = rank_ambulances_by_eta(db, available, patient_lat, patient_lon)
    best_ambulance, best_eta = ranked[0]

    # Update ambulance status (use .with_for_update() for row locking in production)
    db.query(models.Ambulance).filter(
        models.Ambulance.ambulance_id == best_ambulance.ambulance_id
    ).update({
        "is_available": False,
        "status": "dispatched",
        "updated_at": datetime.utcnow(),
    })

    # Update driver status if assigned
    if best_ambulance.driver_id:
        db.query(models.Driver).filter(
            models.Driver.driver_id == best_ambulance.driver_id
        ).update({
            "is_available": False,
            "status": "on_trip",
            "updated_at": datetime.utcnow(),
        })

    # Create assignment record
    assignment = models.DispatchAssignment(
        request_id=request.request_id,
        ambulance_id=best_ambulance.ambulance_id,
        driver_id=best_ambulance.driver_id,
        status="assigned",
        estimated_arrival_seconds=best_eta,
    )
    db.add(assignment)

    # Update emergency request status
    db.query(models.EmergencyRequest).filter(
        models.EmergencyRequest.request_id == request.request_id
    ).update({"status": "dispatched", "updated_at": datetime.utcnow()})

    db.commit()
    db.refresh(assignment)
    return assignment


def cancel_assignment(db: Session, assignment_id: int, reason: str = "") -> bool:
    """Cancel a dispatch assignment and free the ambulance."""
    assignment = db.query(models.DispatchAssignment).filter(
        models.DispatchAssignment.assignment_id == assignment_id
    ).first()
    if not assignment:
        return False

    assignment.status = "cancelled"
    assignment.rejection_reason = reason

    if assignment.ambulance_id:
        db.query(models.Ambulance).filter(
            models.Ambulance.ambulance_id == assignment.ambulance_id
        ).update({"is_available": True, "status": "available", "updated_at": datetime.utcnow()})

    if assignment.driver_id:
        db.query(models.Driver).filter(
            models.Driver.driver_id == assignment.driver_id
        ).update({"is_available": True, "status": "online", "updated_at": datetime.utcnow()})

    db.commit()
    return True


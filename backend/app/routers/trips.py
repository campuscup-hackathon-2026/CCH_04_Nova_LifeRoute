"""Trips router."""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.connection import get_db
from app.database import models

router = APIRouter()


class TripCreate(BaseModel):
    request_id: Optional[int] = None
    assignment_id: Optional[int] = None
    hospital_id: Optional[int] = None
    pickup_latitude: Optional[float] = None
    pickup_longitude: Optional[float] = None
    dropoff_latitude: Optional[float] = None
    dropoff_longitude: Optional[float] = None
    is_simulated: bool = False


@router.post("/", status_code=201)
def create_trip(
    payload: TripCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "driver")),
):
    trip = models.Trip(
        **payload.model_dump(),
        status="in_progress",
        started_at=datetime.utcnow(),
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return {"trip_id": trip.trip_id, "status": trip.status}


@router.get("/")
def list_trips(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    q = db.query(models.Trip)
    # Drivers see only their trips via dispatch_assignments
    trips = q.order_by(models.Trip.started_at.desc()).limit(50).all()
    return [
        {
            "trip_id": t.trip_id,
            "request_id": t.request_id,
            "hospital_id": t.hospital_id,
            "status": t.status,
            "started_at": t.started_at,
            "completed_at": t.completed_at,
            "total_distance_km": float(t.total_distance_km) if t.total_distance_km else None,
            "total_duration_seconds": t.total_duration_seconds,
            "is_simulated": t.is_simulated,
        }
        for t in trips
    ]


@router.get("/{trip_id}")
def get_trip(trip_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    t = db.query(models.Trip).filter(models.Trip.trip_id == trip_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {
        "trip_id": t.trip_id,
        "request_id": t.request_id,
        "assignment_id": t.assignment_id,
        "hospital_id": t.hospital_id,
        "status": t.status,
        "pickup_latitude": float(t.pickup_latitude) if t.pickup_latitude else None,
        "pickup_longitude": float(t.pickup_longitude) if t.pickup_longitude else None,
        "dropoff_latitude": float(t.dropoff_latitude) if t.dropoff_latitude else None,
        "dropoff_longitude": float(t.dropoff_longitude) if t.dropoff_longitude else None,
        "started_at": t.started_at,
        "completed_at": t.completed_at,
        "total_distance_km": float(t.total_distance_km) if t.total_distance_km else None,
        "total_duration_seconds": t.total_duration_seconds,
        "is_simulated": t.is_simulated,
    }


@router.patch("/{trip_id}/complete", dependencies=[Depends(require_role("admin", "driver"))])
def complete_trip(trip_id: int, distance_km: Optional[float] = None, db: Session = Depends(get_db)):
    t = db.query(models.Trip).filter(models.Trip.trip_id == trip_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Trip not found")
    t.status = "completed"
    t.completed_at = datetime.utcnow()
    if distance_km:
        t.total_distance_km = distance_km
    if t.started_at:
        t.total_duration_seconds = int((t.completed_at - t.started_at).total_seconds())
    db.commit()
    return {"message": f"Trip {trip_id} completed"}


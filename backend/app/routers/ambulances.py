"""Ambulances router."""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.connection import get_db
from app.database import models
from app.schemas.ambulance import AmbulanceOut, AmbulanceStatusUpdate, AmbulanceLocationCreate

router = APIRouter()


@router.get("/", response_model=List[AmbulanceOut])
def list_ambulances(
    available_only: bool = Query(False),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(models.Ambulance)
    if available_only:
        q = q.filter(models.Ambulance.is_available == True)
    return q.all()


@router.get("/{ambulance_id}", response_model=AmbulanceOut)
def get_ambulance(ambulance_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    amb = db.query(models.Ambulance).filter(models.Ambulance.ambulance_id == ambulance_id).first()
    if not amb:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    return amb


@router.patch("/{ambulance_id}/status", response_model=AmbulanceOut)
def update_status(
    ambulance_id: int,
    payload: AmbulanceStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "driver", "hospital_staff")),
):
    amb = db.query(models.Ambulance).filter(models.Ambulance.ambulance_id == ambulance_id).first()
    if not amb:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    amb.status = payload.status
    amb.is_available = payload.is_available
    amb.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(amb)
    return amb


@router.post("/{ambulance_id}/location")
def update_location(
    ambulance_id: int,
    payload: AmbulanceLocationCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "driver")),
):
    """Record a new location ping for an ambulance."""
    amb = db.query(models.Ambulance).filter(models.Ambulance.ambulance_id == ambulance_id).first()
    if not amb:
        raise HTTPException(status_code=404, detail="Ambulance not found")

    loc = models.AmbulanceLocation(
        ambulance_id=ambulance_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        speed_kmh=payload.speed_kmh,
        heading=payload.heading,
        is_simulated=payload.is_simulated,
    )
    db.add(loc)

    # Update ambulance current position
    amb.current_latitude = payload.latitude
    amb.current_longitude = payload.longitude
    amb.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Location updated", "ambulance_id": ambulance_id}


@router.get("/{ambulance_id}/locations")
def get_location_history(ambulance_id: int, limit: int = 50, db: Session = Depends(get_db), _=Depends(get_current_user)):
    locs = (
        db.query(models.AmbulanceLocation)
        .filter(models.AmbulanceLocation.ambulance_id == ambulance_id)
        .order_by(models.AmbulanceLocation.recorded_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "location_id": l.location_id,
            "latitude": float(l.latitude),
            "longitude": float(l.longitude),
            "speed_kmh": float(l.speed_kmh) if l.speed_kmh else None,
            "heading": float(l.heading) if l.heading else None,
            "recorded_at": l.recorded_at,
            "is_simulated": l.is_simulated,
        }
        for l in locs
    ]


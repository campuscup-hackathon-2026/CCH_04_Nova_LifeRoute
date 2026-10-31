"""Traffic incidents router."""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.connection import get_db
from app.database import models

router = APIRouter()


class IncidentCreate(BaseModel):
    edge_id: Optional[int] = None
    incident_type: str = "congestion"
    severity: str = "medium"
    speed_reduction_pct: float = 30.0
    is_road_closed: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    is_simulated: bool = True


@router.get("/", response_model=List[dict])
def list_incidents(active_only: bool = True, db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(models.TrafficIncident)
    if active_only:
        q = q.filter(models.TrafficIncident.is_active == True)
    incidents = q.order_by(models.TrafficIncident.reported_at.desc()).all()
    return [
        {
            "incident_id": i.incident_id,
            "edge_id": i.edge_id,
            "incident_type": i.incident_type,
            "severity": i.severity,
            "speed_reduction_pct": float(i.speed_reduction_pct or 0),
            "is_road_closed": i.is_road_closed,
            "latitude": float(i.latitude) if i.latitude else None,
            "longitude": float(i.longitude) if i.longitude else None,
            "description": i.description,
            "reported_at": i.reported_at,
            "is_active": i.is_active,
            "is_simulated": i.is_simulated,
        }
        for i in incidents
    ]


@router.post("/", status_code=201)
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    incident = models.TrafficIncident(**payload.model_dump())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return {"incident_id": incident.incident_id, "message": "Incident created"}


@router.patch("/{incident_id}/resolve")
def resolve_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    incident = db.query(models.TrafficIncident).filter(models.TrafficIncident.incident_id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.is_active = False
    incident.resolved_at = datetime.utcnow()
    db.commit()
    return {"message": f"Incident {incident_id} resolved"}


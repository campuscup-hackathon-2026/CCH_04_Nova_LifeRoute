"""
Simulation router — manage demo/hackathon simulations.

[SIMULATION] All endpoints here operate on simulated data only.
They allow the frontend to trigger demo scenarios without a real ambulance.
"""
import asyncio
import random
import math
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.database.connection import get_db
from app.database import models
from app.services.tracking_service import manager
from app.utils.geo_utils import interpolate_position, bearing_degrees

router = APIRouter()

# In-memory simulation state
_sim_state: dict = {
    "active": False,
    "ambulance_id": None,
    "current_lat": None,
    "current_lon": None,
    "target_lat": None,
    "target_lon": None,
    "step": 0,
    "total_steps": 20,
}


class SimStart(BaseModel):
    ambulance_id: int
    from_latitude: float
    from_longitude: float
    to_latitude: float
    to_longitude: float
    steps: int = 20


class MoveAmbulance(BaseModel):
    ambulance_id: int
    latitude: float
    longitude: float
    speed_kmh: float = 60.0


class RoadClosure(BaseModel):
    edge_id: int
    description: Optional[str] = "Simulated road closure"


@router.post("/start")
async def start_simulation(
    payload: SimStart,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    """Start a simulated ambulance run from A to B."""
    global _sim_state
    _sim_state = {
        "active": True,
        "ambulance_id": payload.ambulance_id,
        "current_lat": payload.from_latitude,
        "current_lon": payload.from_longitude,
        "target_lat": payload.to_latitude,
        "target_lon": payload.to_longitude,
        "step": 0,
        "total_steps": payload.steps,
    }

    # Update ambulance status to dispatched
    db.query(models.Ambulance).filter(
        models.Ambulance.ambulance_id == payload.ambulance_id
    ).update({"status": "dispatched", "is_available": False})
    db.commit()

    background_tasks.add_task(_run_simulation, payload.ambulance_id, payload)
    return {"message": "Simulation started", "ambulance_id": payload.ambulance_id, "steps": payload.steps, "is_simulated": True}


async def _run_simulation(ambulance_id: int, payload: SimStart):
    """Background task: broadcast simulated location updates every 2 seconds."""
    for step in range(payload.steps + 1):
        fraction = step / payload.steps
        lat, lon = interpolate_position(
            payload.from_latitude, payload.from_longitude,
            payload.to_latitude, payload.to_longitude,
            fraction,
        )
        heading = bearing_degrees(
            payload.from_latitude, payload.from_longitude,
            payload.to_latitude, payload.to_longitude,
        )
        remaining_steps = payload.steps - step
        eta_seconds = remaining_steps * 2   # 2s per step

        await manager.send_location_update(
            ambulance_id=ambulance_id,
            lat=lat,
            lon=lon,
            speed_kmh=random.uniform(40, 80),
            heading=heading,
            status="en_route" if step < payload.steps else "arrived",
            eta_seconds=eta_seconds,
        )
        _sim_state["step"] = step
        _sim_state["current_lat"] = lat
        _sim_state["current_lon"] = lon

        if step >= payload.steps:
            _sim_state["active"] = False
            break
        await asyncio.sleep(2)


@router.post("/move-ambulance")
def move_ambulance(
    payload: MoveAmbulance,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    """Manually move a simulated ambulance to a new position."""
    loc = models.AmbulanceLocation(
        ambulance_id=payload.ambulance_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        speed_kmh=payload.speed_kmh,
        is_simulated=True,
    )
    db.add(loc)
    db.query(models.Ambulance).filter(
        models.Ambulance.ambulance_id == payload.ambulance_id
    ).update({"current_latitude": payload.latitude, "current_longitude": payload.longitude})
    db.commit()
    return {"message": "Ambulance moved", "latitude": payload.latitude, "longitude": payload.longitude, "is_simulated": True}


@router.post("/road-closure")
def simulate_road_closure(
    payload: RoadClosure,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    """Simulate a road closure on a specific edge."""
    incident = models.TrafficIncident(
        edge_id=payload.edge_id,
        incident_type="road_closure",
        severity="critical",
        speed_reduction_pct=100,
        is_road_closed=True,
        description=payload.description,
        is_simulated=True,
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return {"message": "Road closure simulated", "incident_id": incident.incident_id, "edge_id": payload.edge_id, "is_simulated": True}


@router.post("/resolve-closure/{incident_id}")
def resolve_simulated_closure(
    incident_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin")),
):
    """Resolve a simulated road closure."""
    incident = db.query(models.TrafficIncident).filter(models.TrafficIncident.incident_id == incident_id).first()
    if not incident:
        return {"message": "Incident not found"}
    incident.is_active = False
    incident.resolved_at = datetime.utcnow()
    db.commit()
    return {"message": f"Closure {incident_id} resolved", "is_simulated": True}


@router.get("/status")
def get_simulation_status(_=Depends(require_role("admin"))):
    """Get current simulation state."""
    return {**_sim_state, "is_simulated": True}


@router.post("/reset")
def reset_simulation(db: Session = Depends(get_db), _=Depends(require_role("admin"))):
    """Reset all simulated ambulances to available."""
    global _sim_state
    _sim_state = {"active": False}

    db.query(models.Ambulance).filter(models.Ambulance.status == "dispatched").update(
        {"status": "available", "is_available": True}
    )
    db.query(models.TrafficIncident).filter(
        models.TrafficIncident.is_simulated == True,
        models.TrafficIncident.is_active == True,
    ).update({"is_active": False, "resolved_at": datetime.utcnow()})
    db.commit()
    return {"message": "Simulation reset", "is_simulated": True}


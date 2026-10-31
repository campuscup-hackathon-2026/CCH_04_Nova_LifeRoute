"""Routes router — compute and retrieve road routes."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.database import models
from app.schemas.route import RouteRequest, RouteVersionOut
from app.services import routing_service

router = APIRouter()


@router.post("/calculate")
def calculate_route(payload: RouteRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Calculate shortest path between two lat/lon points using the road graph.
    Falls back to Haversine straight-line if graph has no data.
    """
    G, nodes_dict = routing_service.build_graph(db)
    result = routing_service.find_shortest_path(
        G, nodes_dict,
        payload.from_latitude, payload.from_longitude,
        payload.to_latitude, payload.to_longitude,
    )
    if not result:
        raise HTTPException(status_code=404, detail="No route found")
    return result


@router.get("/trips/{trip_id}", response_model=List[RouteVersionOut])
def get_trip_routes(trip_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Get all route versions for a trip (includes reroutes)."""
    versions = (
        db.query(models.RouteVersion)
        .filter(models.RouteVersion.trip_id == trip_id)
        .order_by(models.RouteVersion.version_number.asc())
        .all()
    )
    return versions


@router.post("/trips/{trip_id}/reroute")
def reroute_trip(
    trip_id: int,
    payload: RouteRequest,
    reason: str = "traffic_incident",
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Recalculate and save a new route version for a trip (dynamic rerouting)."""
    trip = db.query(models.Trip).filter(models.Trip.trip_id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    G, nodes_dict = routing_service.build_graph(db)
    result = routing_service.find_shortest_path(
        G, nodes_dict,
        payload.from_latitude, payload.from_longitude,
        payload.to_latitude, payload.to_longitude,
    )
    if not result:
        raise HTTPException(status_code=404, detail="No alternate route found")

    version = routing_service.save_route_version(
        db, trip_id, "reroute", result, reroute_reason=reason
    )
    return {
        "message": "Route recalculated",
        "version_id": version.version_id,
        "version_number": version.version_number,
        "total_distance_km": result["total_distance_km"],
        "estimated_duration_seconds": result["estimated_duration_seconds"],
        "is_fallback": result.get("is_fallback", False),
    }


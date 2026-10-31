"""Route schemas."""
from typing import List, Optional
from pydantic import BaseModel


class RouteNode(BaseModel):
    node_id: int
    latitude: float
    longitude: float
    name: Optional[str] = None


class RouteSegmentOut(BaseModel):
    sequence_order: int
    from_node_id: int
    to_node_id: int
    distance_km: float
    estimated_duration_seconds: int

    model_config = {"from_attributes": True}


class RouteVersionOut(BaseModel):
    version_id: int
    trip_id: int
    version_number: int
    route_type: str
    total_distance_km: Optional[float]
    estimated_duration_seconds: Optional[int]
    is_current: bool
    reroute_reason: Optional[str]
    segments: List[RouteSegmentOut] = []
    path_nodes: List[RouteNode] = []

    model_config = {"from_attributes": True}


class RouteRequest(BaseModel):
    from_latitude: float
    from_longitude: float
    to_latitude: float
    to_longitude: float


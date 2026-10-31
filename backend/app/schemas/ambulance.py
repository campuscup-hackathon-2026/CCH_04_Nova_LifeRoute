"""Ambulance schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AmbulanceOut(BaseModel):
    ambulance_id: int
    registration_number: str
    vehicle_type: Optional[str]
    status: str
    is_available: bool
    driver_id: Optional[int]
    station_id: Optional[int]
    hospital_id: Optional[int]
    current_latitude: Optional[float]
    current_longitude: Optional[float]
    last_maintenance: Optional[datetime]

    model_config = {"from_attributes": True}


class AmbulanceStatusUpdate(BaseModel):
    status: str
    is_available: bool


class AmbulanceLocationCreate(BaseModel):
    latitude: float
    longitude: float
    speed_kmh: Optional[float] = None
    heading: Optional[float] = None
    is_simulated: bool = True


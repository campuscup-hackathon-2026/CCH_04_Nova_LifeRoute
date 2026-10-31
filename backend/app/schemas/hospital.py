"""Hospital schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class HospitalServiceOut(BaseModel):
    service_id: int
    service_name: str
    is_available: bool
    notes: Optional[str]

    model_config = {"from_attributes": True}


class HospitalOut(BaseModel):
    hospital_id: int
    name: str
    address: Optional[str]
    latitude: float
    longitude: float
    city: Optional[str]
    state: Optional[str]
    contact_phone: Optional[str]
    total_beds: int
    available_beds: int
    icu_beds: int
    available_icu_beds: int
    is_active: bool
    is_verified: bool
    services: List[HospitalServiceOut] = []

    model_config = {"from_attributes": True}


class HospitalRecommendationOut(BaseModel):
    recommendation_id: int
    hospital_id: Optional[int]
    rank: Optional[int]
    score: Optional[float]
    estimated_travel_seconds: Optional[int]
    reason: Optional[str]
    is_selected: bool
    hospital: Optional[HospitalOut] = None

    model_config = {"from_attributes": True}


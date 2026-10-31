"""Emergency request schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class EmergencyRequestCreate(BaseModel):
    patient_latitude: float
    patient_longitude: float
    patient_address: Optional[str] = None
    emergency_type: str = "general"
    severity: str = "high"
    notes: Optional[str] = None


class EmergencyRequestOut(BaseModel):
    request_id: int
    patient_id: Optional[int]
    patient_latitude: float
    patient_longitude: float
    patient_address: Optional[str]
    emergency_type: Optional[str]
    severity: Optional[str]
    notes: Optional[str]
    status: str
    requested_at: datetime
    is_simulated: bool

    model_config = {"from_attributes": True}


class EmergencyStatusUpdate(BaseModel):
    status: str


class EmergencyCall109Request(BaseModel):
    caller_phone: str
    caller_name: Optional[str] = "109 Emergency Caller"
    patient_latitude: float = 12.9716
    patient_longitude: float = 77.5946
    patient_address: Optional[str] = "Triangulated Cell Tower - Emergency 109"
    emergency_type: str = "critical_sos"
    severity: str = "critical"
    voice_transcript: Optional[str] = "Incoming dial 109 emergency SOS call"



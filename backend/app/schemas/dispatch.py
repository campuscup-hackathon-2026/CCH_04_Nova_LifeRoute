"""Dispatch schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DispatchResult(BaseModel):
    assignment_id: int
    request_id: int
    ambulance_id: Optional[int]
    driver_id: Optional[int]
    estimated_arrival_seconds: Optional[int]
    status: str
    assigned_at: datetime
    message: str

    model_config = {"from_attributes": True}


class AssignmentUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None
    notes: Optional[str] = None


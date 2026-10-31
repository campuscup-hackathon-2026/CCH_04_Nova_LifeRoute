"""User schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str


class UserCreate(UserBase):
    password: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        allowed = {"patient", "driver", "admin", "hospital_staff"}
        if v not in allowed:
            raise ValueError(f"Role must be one of {allowed}")
        return v


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class UserOut(UserBase):
    user_id: int
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


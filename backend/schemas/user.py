from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class TravelPreferences(BaseModel):
    model_config = ConfigDict(extra="ignore")

    preferred_cabin: Optional[str] = Field("Economy", description="Economy, Premium Economy, Business")
    preferred_transport: Optional[str] = Field("flight", description="flight, train, bus, cab")
    preferred_seat: Optional[str] = Field("Window", description="Window, Aisle, Any")
    meal_preference: Optional[str] = Field("No Preference", description="Vegetarian, Non-vegetarian, No Preference")
    contact_method: Optional[str] = Field("email", description="email, phone")


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=50)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    email: str
    phone: str
    role: str = "traveler"
    preferences: Optional[Dict[str, Any]] = None
    created_at: datetime


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=5, max_length=50)
    preferences: Optional[Dict[str, Any]] = None


class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)


class DeleteAccountRequest(BaseModel):
    confirmation: str = Field(..., description="Explicit confirmation phrase 'DELETE'")
    password: str = Field(..., min_length=1)

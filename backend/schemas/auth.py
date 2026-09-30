from pydantic import BaseModel, EmailStr, Field, field_validator
from backend.schemas.user import UserRead

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255, description="Full legal name of the traveler")
    email: EmailStr = Field(..., description="Unique email address")
    phone: str = Field(..., min_length=7, max_length=50, description="Contact phone number")
    password: str = Field(..., min_length=6, max_length=128, description="Password with minimum 6 characters")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Full name cannot be empty.")
        return cleaned

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

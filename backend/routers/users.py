from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserRead, UserUpdate
from backend.services.user_service import update_user_profile
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the authenticated traveler's personal profile."""
    return UserRead.model_validate(current_user)

@router.patch("/me", response_model=UserRead)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile fields (full name and phone only). Sensitive fields cannot be modified."""
    updated = update_user_profile(db, current_user, update_data)
    return UserRead.model_validate(updated)

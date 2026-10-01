from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserRead, UserUpdate, PasswordChangeRequest, DeleteAccountRequest
from backend.services.user_service import (
    update_user_profile,
    update_user_preferences,
    change_password,
    delete_user_account,
)
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the authenticated traveler's personal profile and preferences."""
    return UserRead.model_validate(current_user)

@router.patch("/me", response_model=UserRead)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile fields (full name, phone, preferences). Sensitive server fields cannot be modified."""
    updated = update_user_profile(db, current_user, update_data)
    return UserRead.model_validate(updated)

@router.get("/me/preferences", response_model=Dict[str, Any])
def get_preferences(current_user: User = Depends(get_current_user)):
    """Retrieve the traveler's personal travel preferences."""
    return current_user.preferences or {
        "preferred_cabin": "Economy",
        "preferred_transport": "flight",
        "preferred_seat": "Window",
        "meal_preference": "No Preference",
        "contact_method": "email",
    }

@router.patch("/me/preferences", response_model=Dict[str, Any])
def save_preferences(
    preferences: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save or update durable personal travel preferences in PostgreSQL."""
    updated = update_user_preferences(db, current_user, preferences)
    return updated.preferences

@router.post("/me/change-password")
def update_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change the authenticated traveler's password with current password verification."""
    try:
        change_password(db, current_user, req)
        return {"status": "success", "message": "Password changed successfully."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.delete("/me")
def delete_account(
    req: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Danger Zone: Delete the authenticated traveler's account and associated records."""
    try:
        delete_user_account(db, current_user, req)
        return {"status": "success", "message": "Your traveler account has been permanently deleted."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

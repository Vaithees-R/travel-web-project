from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.models.user import User, generate_user_id
from backend.schemas.auth import RegisterRequest
from backend.schemas.user import UserUpdate, PasswordChangeRequest, DeleteAccountRequest
from backend.services.auth_service import hash_password, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    normalized = email.strip().lower()
    return db.query(User).filter(User.email == normalized).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, req: RegisterRequest) -> User:
    normalized_email = req.email.strip().lower()
    hashed = hash_password(req.password)
    user = User(
        id=generate_user_id(),
        full_name=req.full_name.strip(),
        email=normalized_email,
        phone=req.phone.strip(),
        password_hash=hashed,
        role="traveler",
        preferences={
            "preferred_cabin": "Economy",
            "preferred_transport": "flight",
            "preferred_seat": "Window",
            "meal_preference": "No Preference",
            "contact_method": "email",
        },
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user_profile(db: Session, user: User, update_data: UserUpdate) -> User:
    if update_data.full_name is not None:
        user.full_name = update_data.full_name.strip()
    if update_data.phone is not None:
        user.phone = update_data.phone.strip()
    if update_data.preferences is not None:
        current_prefs = dict(user.preferences or {})
        current_prefs.update(update_data.preferences)
        user.preferences = current_prefs
    
    db.commit()
    db.refresh(user)
    return user

def update_user_preferences(db: Session, user: User, prefs: Dict[str, Any]) -> User:
    current_prefs = dict(user.preferences or {})
    current_prefs.update(prefs)
    user.preferences = current_prefs
    db.commit()
    db.refresh(user)
    return user

def change_password(db: Session, user: User, req: PasswordChangeRequest) -> None:
    if not verify_password(req.current_password, user.password_hash):
        raise ValueError("Current password is incorrect.")
    
    if req.new_password != req.confirm_password:
        raise ValueError("New password and confirmation do not match.")
        
    if req.new_password == req.current_password:
        raise ValueError("New password must be different from current password.")

    user.password_hash = hash_password(req.new_password)
    db.commit()
    db.refresh(user)

def delete_user_account(db: Session, user: User, req: DeleteAccountRequest) -> None:
    if req.confirmation.strip().upper() != "DELETE":
        raise ValueError("Confirmation must be 'DELETE' to proceed with account deletion.")
        
    if not verify_password(req.password, user.password_hash):
        raise ValueError("Incorrect password provided for account deletion.")

    db.delete(user)
    db.commit()

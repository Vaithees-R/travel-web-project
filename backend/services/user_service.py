from typing import Optional
from sqlalchemy.orm import Session
from backend.models.user import User, generate_user_id
from backend.schemas.auth import RegisterRequest
from backend.schemas.user import UserUpdate
from backend.services.auth_service import hash_password

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
    
    db.commit()
    db.refresh(user)
    return user

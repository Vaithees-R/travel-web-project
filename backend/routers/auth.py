from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from backend.schemas.user import UserRead
from backend.services.user_service import get_user_by_email, create_user
from backend.services.auth_service import verify_password, create_access_token
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new traveler account with secure password hashing and persistence."""
    existing_user = get_user_by_email(db, req.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered. Please sign in or use another email.",
        )
    
    user = create_user(db, req)
    token = create_access_token(user.id, role=user.role)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserRead.model_validate(user),
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate traveler using email and password, returning JWT and safe profile."""
    user = get_user_by_email(db, req.email)
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(user.id, role=user.role)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserRead.model_validate(user),
    )

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    """Get currently authenticated traveler profile."""
    return UserRead.model_validate(current_user)

@router.post("/logout")
def logout():
    """Client-side token disposal endpoint for stateless JWT session."""
    return {
        "message": "Logged out successfully. The client should discard the local JWT token.",
        "stateless": True,
    }

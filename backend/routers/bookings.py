from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.booking import BookingCreate, BookingRead
from backend.services.booking_service import (
    create_booking,
    get_user_bookings,
    get_booking_by_id_and_user,
    cancel_booking,
)
from backend.dependencies.auth import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def book_journey(
    data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new journey booking.
    CRITICAL: user_id is extracted strictly from the validated JWT token of current_user.
    Frontend user_id inputs are NEVER trusted.
    """
    return create_booking(db, user_id=current_user.id, data=data)

@router.get("", response_model=List[BookingRead])
def list_user_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve all bookings belonging to the currently authenticated traveler.
    User A can never see User B's bookings.
    """
    return get_user_bookings(db, user_id=current_user.id)

@router.get("/{booking_id}", response_model=BookingRead)
def get_booking_detail(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve specific booking by ID.
    Enforces strict ownership check: returns 404 if booking does not belong to the user.
    """
    booking = get_booking_by_id_and_user(db, booking_id=booking_id, user_id=current_user.id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found or you are not authorized to view it.",
        )
    return booking

@router.patch("/{booking_id}/cancel", response_model=BookingRead)
def cancel_user_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cancel an existing booking belonging to the authenticated traveler.
    Enforces strict ownership check: returns 404 if booking does not belong to the user.
    """
    cancelled = cancel_booking(db, booking_id=booking_id, user_id=current_user.id)
    if not cancelled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found or you are not authorized to modify it.",
        )
    return cancelled

@router.delete("/{booking_id}", response_model=BookingRead)
def delete_user_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel booking alias for HTTP DELETE standard compliance."""
    return cancel_user_booking(booking_id=booking_id, current_user=current_user, db=db)

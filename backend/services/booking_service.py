import random
import string
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models.booking import Booking, generate_booking_id
from backend.schemas.booking import BookingCreate, BookingRead

def generate_realistic_reference(service: str) -> str:
    """Generate authentic travel reference formatted by transport mode."""
    rand_alpha = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    rand_digits = "".join(random.choices(string.digits, k=7))
    if service == "flight":
        return f"PNR {rand_alpha}"
    elif service == "train":
        return f"PNR {rand_digits[:3]}-{rand_digits[3:]}"
    elif service == "bus":
        return f"VOY-BUS-{random.randint(1000, 9999)}"
    elif service == "cab":
        return f"VOY-CAB-{random.randint(1000, 9999)}"
    return f"REF-{rand_alpha}"

def format_booking_response(b: Booking) -> BookingRead:
    created_at_iso = b.created_at.isoformat() if hasattr(b.created_at, "isoformat") else str(b.created_at)
    return BookingRead(
        id=b.id,
        userId=b.user_id,
        bookingRef=b.booking_reference,
        service=b.transport_type,
        status=b.status,
        createdAt=created_at_iso,
        origin=b.origin,
        destination=b.destination,
        departureTime=b.departure_time,
        arrivalTime=b.arrival_time,
        travelDate=b.travel_date,
        passengersCount=b.passenger_count,
        seatOrBerthAllocated=b.seat_allocation,
        primaryPassenger=b.primary_passenger,
        additionalPassengers=b.additional_passengers,
        fareBreakdown=b.fare_breakdown,
        travelOption=b.selected_option,
        searchCriteria=b.search_criteria,
        isSimulated=b.is_simulated,
        paymentMethod=b.payment_method or "card",
        paymentStatus=b.payment_status or "paid",
        paymentReference=b.payment_reference,
        booking_reference=b.booking_reference,
        user_id=b.user_id,
        transport_type=b.transport_type,
        payment_method=b.payment_method or "card",
        payment_status=b.payment_status or "paid",
        payment_reference=b.payment_reference,
    )

def create_booking(db: Session, user_id: str, data: BookingCreate) -> BookingRead:
    # 1. Reject bookings where simulated payment failed
    if data.paymentStatus and data.paymentStatus.lower() == "failed":
        raise ValueError("Cannot create a confirmed booking when payment has failed.")

    # 2. Check for duplicate submission / ID collision
    booking_id = data.bookingId if (data.bookingId and data.bookingId.startswith("VH-")) else generate_booking_id()
    if data.bookingId:
        existing = db.query(Booking).filter(Booking.id == booking_id).first()
        if existing:
            if existing.user_id == user_id:
                # Idempotent retry by the same user: return existing booking safely
                return format_booking_response(existing)
            else:
                # ID collision with another user's booking: generate fresh secure ID
                booking_id = generate_booking_id()

    booking_ref = data.bookingRef or generate_realistic_reference(data.service)

    travel_opt = data.travelOption
    search_crit = data.searchCriteria or {}

    origin = travel_opt.get("originCity") or search_crit.get("from") or "Origin"
    destination = travel_opt.get("destinationCity") or search_crit.get("to") or "Destination"
    departure_time = travel_opt.get("departureTime") or "08:00 AM"
    arrival_time = travel_opt.get("arrivalTime") or "11:30 AM"
    travel_date = search_crit.get("departureDate") or "Tomorrow, 08:30 AM"

    # Simulated payment reference if none passed
    simulated_payment_ref = data.paymentReference or f"TXN-2026-PAY-{''.join(random.choices(string.ascii_uppercase + string.digits, k=8))}"

    booking = Booking(
        id=booking_id,
        user_id=user_id,
        booking_reference=booking_ref,
        transport_type=data.service,
        status="upcoming",
        origin=origin,
        destination=destination,
        travel_date=travel_date,
        departure_time=departure_time,
        arrival_time=arrival_time,
        passenger_count=data.passengersCount,
        seat_allocation=data.seatOrBerthAllocated or "Confirmed",
        primary_passenger=data.primaryPassenger,
        additional_passengers=data.additionalPassengers,
        fare_breakdown=data.fareBreakdown,
        selected_option=travel_opt,
        search_criteria=search_crit,
        payment_status=data.paymentStatus or "paid",
        payment_method=data.paymentMethod or "card",
        payment_reference=simulated_payment_ref,
        is_simulated=True,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return format_booking_response(booking)

def get_user_bookings(db: Session, user_id: str) -> List[BookingRead]:
    # Strictly return only bookings belonging to the current user
    records = (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [format_booking_response(b) for b in records]

def get_booking_by_id_and_user(db: Session, booking_id: str, user_id: str) -> Optional[BookingRead]:
    record = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == user_id)
        .first()
    )
    if not record:
        return None
    return format_booking_response(record)

def cancel_booking(db: Session, booking_id: str, user_id: str) -> Optional[BookingRead]:
    record = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == user_id)
        .first()
    )
    if not record:
        return None

    if record.status == "cancelled":
        return format_booking_response(record)

    record.status = "cancelled"
    record.payment_status = "refunded"
    db.commit()
    db.refresh(record)
    return format_booking_response(record)

import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

# Use JSONB with JSON fallback for test compatibility
JSON_TYPE = JSONB().with_variant(JSON(), "sqlite")

def generate_booking_id() -> str:
    random_hex = uuid.uuid4().hex[:5].upper()
    return f"VH-2026-{random_hex}"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(50), primary_key=True, default=generate_booking_id, index=True)
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    booking_reference = Column(String(100), nullable=False, index=True)
    transport_type = Column(String(50), nullable=False) # flight, train, bus, cab
    status = Column(String(50), default="upcoming", nullable=False) # upcoming, completed, cancelled
    
    # Route details
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    travel_date = Column(String(100), nullable=False)
    departure_time = Column(String(50), nullable=False)
    arrival_time = Column(String(50), nullable=False)
    passenger_count = Column(Integer, default=1, nullable=False)
    seat_allocation = Column(String(255), nullable=True)

    # Detailed travel structures for 100% frontend fidelity
    primary_passenger = Column(JSON_TYPE, nullable=False)
    additional_passengers = Column(JSON_TYPE, nullable=True)
    fare_breakdown = Column(JSON_TYPE, nullable=False)
    selected_option = Column(JSON_TYPE, nullable=False)
    search_criteria = Column(JSON_TYPE, nullable=True)
    
    # Phase 7 Payment tracking
    payment_status = Column(String(50), default="paid", nullable=False) # paid, pending, failed
    payment_method = Column(String(50), nullable=True) # upi, card, net_banking
    payment_reference = Column(String(100), nullable=True)

    is_simulated = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookings")

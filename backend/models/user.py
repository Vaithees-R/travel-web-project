import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

def generate_user_id() -> str:
    return f"usr_{uuid.uuid4().hex[:12]}"

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=generate_user_id, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="traveler", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")

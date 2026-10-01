from typing import Any, Dict, List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator


class BookingCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    service: Literal["flight", "train", "bus", "cab"] = Field(..., description="Transport mode: flight, train, bus, cab")
    travelOption: Dict[str, Any] = Field(..., description="Selected travel option data")
    searchCriteria: Optional[Dict[str, Any]] = Field(None, description="Search criteria used")
    primaryPassenger: Dict[str, Any] = Field(..., description="Primary passenger information")
    additionalPassengers: Optional[List[Dict[str, Any]]] = Field(None, description="Additional passengers")
    passengersCount: int = Field(1, ge=1, le=50, description="Total passenger count (1-50)")
    seatOrBerthAllocated: Optional[str] = Field(None, max_length=255, description="Assigned seat or berth")
    fareBreakdown: Dict[str, Any] = Field(..., description="Fare calculation breakdown")
    bookingRef: Optional[str] = Field(None, max_length=100, description="Generated booking reference")
    bookingId: Optional[str] = Field(None, max_length=50, description="Client pre-generated booking identifier if available")
    paymentMethod: Optional[Literal["card", "upi", "net_banking"]] = Field("card", description="Payment method used")
    paymentStatus: Optional[Literal["paid", "pending", "failed"]] = Field("paid", description="Payment status: paid, pending, failed")
    paymentReference: Optional[str] = Field(None, max_length=100, description="Payment transaction reference")

    @field_validator("primaryPassenger")
    @classmethod
    def validate_primary_passenger(cls, v: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(v, dict):
            raise ValueError("Primary passenger information must be an object.")
        full_name = v.get("fullName") or v.get("full_name") or v.get("name")
        if not full_name or not str(full_name).strip():
            raise ValueError("Primary passenger must have a valid full name.")
        return v

class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    userId: str
    bookingRef: str
    service: str
    status: str
    createdAt: str
    origin: str
    destination: str
    departureTime: str
    arrivalTime: str
    travelDate: str
    passengersCount: int
    seatOrBerthAllocated: Optional[str]
    primaryPassenger: Dict[str, Any]
    additionalPassengers: Optional[List[Dict[str, Any]]]
    fareBreakdown: Dict[str, Any]
    travelOption: Dict[str, Any]
    searchCriteria: Optional[Dict[str, Any]]
    isSimulated: bool = True
    paymentMethod: Optional[str] = None
    paymentStatus: Optional[str] = "paid"
    paymentReference: Optional[str] = None

    # Also support snake_case aliases for API parity
    booking_reference: Optional[str] = None
    user_id: Optional[str] = None
    transport_type: Optional[str] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    payment_reference: Optional[str] = None

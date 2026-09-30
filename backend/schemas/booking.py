from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class BookingCreate(BaseModel):
    service: str = Field(..., description="Transport mode: flight, train, bus, cab")
    travelOption: Dict[str, Any] = Field(..., description="Selected travel option data")
    searchCriteria: Optional[Dict[str, Any]] = Field(None, description="Search criteria used")
    primaryPassenger: Dict[str, Any] = Field(..., description="Primary passenger information")
    additionalPassengers: Optional[List[Dict[str, Any]]] = Field(None, description="Additional passengers")
    passengersCount: int = Field(1, ge=1, description="Total passenger count")
    seatOrBerthAllocated: Optional[str] = Field(None, description="Assigned seat or berth")
    fareBreakdown: Dict[str, Any] = Field(..., description="Fare calculation breakdown")
    bookingRef: Optional[str] = Field(None, description="Generated booking reference")
    bookingId: Optional[str] = Field(None, description="Client pre-generated booking identifier if available")
    paymentMethod: Optional[str] = Field("card", description="Payment method used: card, upi, net_banking")
    paymentStatus: Optional[str] = Field("paid", description="Payment status: paid, pending, failed")
    paymentReference: Optional[str] = Field(None, description="Payment transaction reference")

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

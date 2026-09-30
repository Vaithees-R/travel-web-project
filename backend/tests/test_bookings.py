import pytest

@pytest.fixture
def user_a(client):
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Traveler User A",
            "email": "user_a@voyagehub.com",
            "phone": "+91 91111 11111",
            "password": "Password123!",
        },
    )
    return res.json()

@pytest.fixture
def user_b(client):
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Traveler User B",
            "email": "user_b@voyagehub.com",
            "phone": "+91 92222 22222",
            "password": "Password123!",
        },
    )
    return res.json()

sample_booking_payload = {
    "service": "flight",
    "travelOption": {
        "id": "opt_fl_101",
        "service": "flight",
        "operator": "IndiGo",
        "identifier": "6E 204",
        "subType": "Airbus A321neo",
        "originCity": "Mumbai",
        "originCode": "BOM",
        "originStationOrTerminal": "Chhatrapati Shivaji Maharaj T2",
        "destinationCity": "Delhi",
        "destinationCode": "DEL",
        "destinationStationOrTerminal": "Indira Gandhi International T3",
        "departureTime": "06:00 AM",
        "arrivalTime": "08:15 AM",
        "duration": "2h 15m",
        "stops": 0,
        "baseFare": 4500,
        "availableUnits": 8,
        "amenities": ["In-flight Wi-Fi", "USB Power"],
    },
    "searchCriteria": {
        "service": "flight",
        "from": "Mumbai",
        "fromCode": "BOM",
        "to": "Delhi",
        "toCode": "DEL",
        "departureDate": "Tomorrow, 06:00 AM",
        "tripType": "oneway",
        "passengers": 1,
    },
    "primaryPassenger": {
        "id": "pax_1",
        "fullName": "Traveler User A",
        "email": "user_a@voyagehub.com",
        "phone": "+91 91111 11111",
        "gender": "male",
        "age": 30,
    },
    "passengersCount": 1,
    "seatOrBerthAllocated": "Seat 12A (Economy)",
    "fareBreakdown": {
        "baseFarePerPassenger": 4500,
        "passengerCount": 1,
        "subtotalBaseFare": 4500,
        "taxesAndTerminalFees": 540,
        "safetyOrServiceFee": 150,
        "totalFare": 5190,
        "currency": "INR",
    },
}

def test_create_booking_as_user_a(client, user_a):
    token_a = user_a["access_token"]
    res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    assert res.status_code == 201
    booking = res.json()
    assert booking["userId"] == user_a["user"]["id"]
    assert booking["service"] == "flight"
    assert booking["status"] == "upcoming"
    assert booking["origin"] == "Mumbai"
    assert booking["destination"] == "Delhi"
    assert "bookingRef" in booking

def test_user_a_sees_booking(client, user_a):
    token_a = user_a["access_token"]
    # Create booking
    create_res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    booking_id = create_res.json()["id"]

    # List bookings
    list_res = client.get(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert list_res.status_code == 200
    bookings = list_res.json()
    assert len(bookings) >= 1
    assert any(b["id"] == booking_id for b in bookings)

def test_user_b_does_not_see_user_a_booking(client, user_a, user_b):
    token_a = user_a["access_token"]
    token_b = user_b["access_token"]

    # User A creates a booking
    create_res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    booking_id = create_res.json()["id"]

    # User B lists their bookings
    list_b_res = client.get(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert list_b_res.status_code == 200
    bookings_b = list_b_res.json()
    # User B must NOT see User A's booking
    assert not any(b["id"] == booking_id for b in bookings_b)

def test_user_b_cannot_access_user_a_booking_by_id(client, user_a, user_b):
    token_a = user_a["access_token"]
    token_b = user_b["access_token"]

    # User A creates a booking
    create_res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    booking_id = create_res.json()["id"]

    # User B attempts to access User A's booking ID
    get_res = client.get(
        f"/api/bookings/{booking_id}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert get_res.status_code == 404
    assert "not found or you are not authorized" in get_res.json()["detail"].lower()

def test_user_b_cannot_cancel_user_a_booking(client, user_a, user_b):
    token_a = user_a["access_token"]
    token_b = user_b["access_token"]

    # User A creates a booking
    create_res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    booking_id = create_res.json()["id"]

    # User B attempts to cancel User A's booking
    cancel_res = client.patch(
        f"/api/bookings/{booking_id}/cancel",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert cancel_res.status_code == 404

def test_user_a_can_cancel_own_booking_and_status_persists(client, user_a):
    token_a = user_a["access_token"]

    # User A creates a booking
    create_res = client.post(
        "/api/bookings",
        headers={"Authorization": f"Bearer {token_a}"},
        json=sample_booking_payload,
    )
    booking_id = create_res.json()["id"]

    # User A cancels own booking
    cancel_res = client.patch(
        f"/api/bookings/{booking_id}/cancel",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"

    # Verify status persists on subsequent get
    get_res = client.get(
        f"/api/bookings/{booking_id}",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert get_res.status_code == 200
    assert get_res.json()["status"] == "cancelled"

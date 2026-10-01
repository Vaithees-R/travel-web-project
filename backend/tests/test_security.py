import datetime
import jwt
import pytest
from backend.config import settings

@pytest.fixture
def auth_user_1(client):
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Security User One",
            "email": "sec_user1@voyagehub.com",
            "phone": "+91 98888 11111",
            "password": "Password123!",
        },
    )
    assert res.status_code == 201
    return res.json()

@pytest.fixture
def auth_user_2(client):
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Security User Two",
            "email": "sec_user2@voyagehub.com",
            "phone": "+91 98888 22222",
            "password": "Password123!",
        },
    )
    assert res.status_code == 201
    return res.json()

valid_flight_booking = {
    "service": "flight",
    "travelOption": {
        "id": "opt_fl_sec",
        "service": "flight",
        "operator": "Air India",
        "identifier": "AI 808",
        "originCity": "Delhi",
        "destinationCity": "Bengaluru",
        "departureTime": "09:00 AM",
        "arrivalTime": "11:45 AM",
        "baseFare": 5500,
    },
    "searchCriteria": {
        "service": "flight",
        "from": "Delhi",
        "to": "Bengaluru",
        "departureDate": "Tomorrow, 09:00 AM",
        "tripType": "oneway",
        "passengers": 1,
    },
    "primaryPassenger": {
        "fullName": "Security User One",
        "email": "sec_user1@voyagehub.com",
        "phone": "+91 98888 11111",
    },
    "passengersCount": 1,
    "seatOrBerthAllocated": "14C",
    "fareBreakdown": {
        "baseFare": 5500,
        "totalFare": 6100,
        "currency": "INR",
    },
    "paymentMethod": "card",
    "paymentStatus": "paid",
    "paymentReference": "TXN-SEC-PASS-001",
}

# 1. Unauthorized Access
def test_unauthorized_access_rejected(client):
    # Bookings list
    res_bookings = client.get("/api/bookings")
    assert res_bookings.status_code == 401
    assert "WWW-Authenticate" in res_bookings.headers

    # Profile
    res_me = client.get("/api/users/me")
    assert res_me.status_code == 401

    # Create booking
    res_create = client.post("/api/bookings", json=valid_flight_booking)
    assert res_create.status_code == 401

# 2. Invalid & Malformed JWT
def test_invalid_jwt_token_rejected(client):
    headers = {"Authorization": "Bearer malformed.invalid.token"}
    res = client.get("/api/bookings", headers=headers)
    assert res.status_code == 401
    assert "invalid or expired" in res.json()["detail"].lower()

# 3. Expired JWT Token
def test_expired_jwt_token_rejected(client, auth_user_1):
    user_id = auth_user_1["user"]["id"]
    past_time = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)
    expired_payload = {
        "sub": user_id,
        "role": "traveler",
        "iat": past_time - datetime.timedelta(hours=1),
        "exp": past_time,
    }
    expired_token = jwt.encode(expired_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    res = client.get("/api/bookings", headers={"Authorization": f"Bearer {expired_token}"})
    assert res.status_code == 401
    assert "invalid or expired" in res.json()["detail"].lower()

# 4. Token with Wrong Secret
def test_token_with_wrong_secret_rejected(client, auth_user_1):
    user_id = auth_user_1["user"]["id"]
    fake_token = jwt.encode(
        {"sub": user_id, "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)},
        "attacker_different_secret_key_12345",
        algorithm="HS256"
    )
    res = client.get("/api/bookings", headers={"Authorization": f"Bearer {fake_token}"})
    assert res.status_code == 401

# 5. Cross-User IDOR Protection on Bookings
def test_cross_user_booking_isolation(client, auth_user_1, auth_user_2):
    token_1 = auth_user_1["access_token"]
    token_2 = auth_user_2["access_token"]

    # User 1 creates booking
    create_res = client.post("/api/bookings", headers={"Authorization": f"Bearer {token_1}"}, json=valid_flight_booking)
    assert create_res.status_code == 201
    booking_id = create_res.json()["id"]

    # User 2 attempts to read User 1's booking
    read_res = client.get(f"/api/bookings/{booking_id}", headers={"Authorization": f"Bearer {token_2}"})
    assert read_res.status_code == 404
    assert "not authorized" in read_res.json()["detail"].lower()

    # User 2 attempts to cancel User 1's booking
    cancel_res = client.patch(f"/api/bookings/{booking_id}/cancel", headers={"Authorization": f"Bearer {token_2}"})
    assert cancel_res.status_code == 404

    # User 2 attempts DELETE on User 1's booking
    delete_res = client.delete(f"/api/bookings/{booking_id}", headers={"Authorization": f"Bearer {token_2}"})
    assert delete_res.status_code == 404

# 6. Failed Payment CANNOT Create Successful Booking
def test_failed_payment_cannot_create_booking(client, auth_user_1):
    token_1 = auth_user_1["access_token"]
    payload = dict(valid_flight_booking)
    payload["paymentStatus"] = "failed"
    payload["paymentReference"] = "TXN-FAILED-DECLINED"

    res = client.post("/api/bookings", headers={"Authorization": f"Bearer {token_1}"}, json=payload)
    assert res.status_code == 400
    assert "cannot create a confirmed booking when payment has failed" in res.json()["detail"].lower()

# 7. Invalid Transport Mode Payload Rejection
def test_invalid_service_enum_rejected(client, auth_user_1):
    token_1 = auth_user_1["access_token"]
    payload = dict(valid_flight_booking)
    payload["service"] = "spaceship"  # Invalid transport mode

    res = client.post("/api/bookings", headers={"Authorization": f"Bearer {token_1}"}, json=payload)
    assert res.status_code == 422  # Pydantic validation failure

# 8. Invalid Passenger Payload Rejection
def test_invalid_passenger_payload_rejected(client, auth_user_1):
    token_1 = auth_user_1["access_token"]
    payload = dict(valid_flight_booking)
    payload["primaryPassenger"] = {"fullName": "   "}  # Blank name

    res = client.post("/api/bookings", headers={"Authorization": f"Bearer {token_1}"}, json=payload)
    assert res.status_code == 422

# 9. HTTP Security Headers
def test_http_security_headers_present(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"

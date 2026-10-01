def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Alice Johnson",
            "email": "alice@example.com",
            "phone": "+91 98765 43210",
            "password": "Password123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "alice@example.com"
    assert data["user"]["full_name"] == "Alice Johnson"
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]

def test_duplicate_registration_rejected(client):
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Bob Stone",
            "email": "bob@example.com",
            "phone": "+91 98765 11111",
            "password": "Password123!",
        },
    )
    duplicate_res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Bob Stone Duplicate",
            "email": "bob@example.com",
            "phone": "+91 98765 22222",
            "password": "OtherPassword123!",
        },
    )
    assert duplicate_res.status_code == 409
    assert "already registered" in duplicate_res.json()["detail"].lower()

def test_login_succeeds(client):
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Charlie Chaplin",
            "email": "charlie@example.com",
            "phone": "+91 98765 33333",
            "password": "SecretPassword123!",
        },
    )
    login_res = client.post(
        "/api/auth/login",
        json={
            "email": "charlie@example.com",
            "password": "SecretPassword123!",
        },
    )
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "charlie@example.com"

def test_wrong_password_rejected(client):
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Diana Prince",
            "email": "diana@example.com",
            "phone": "+91 98765 44444",
            "password": "CorrectPassword123!",
        },
    )
    login_res = client.post(
        "/api/auth/login",
        json={
            "email": "diana@example.com",
            "password": "WrongPassword456!",
        },
    )
    assert login_res.status_code == 401
    assert login_res.json()["detail"] == "Invalid email or password."

def test_get_me_returns_current_user(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Edward Norton",
            "email": "edward@example.com",
            "phone": "+91 98765 55555",
            "password": "Password123!",
        },
    )
    token = reg.json()["access_token"]
    
    me_res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "edward@example.com"
    assert me_res.json()["full_name"] == "Edward Norton"

def test_protected_endpoint_rejects_missing_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "Authentication token required" in response.json()["detail"]

def test_register_with_camelcase_fullname(client):
    response = client.post(
        "/api/auth/register",
        json={
            "fullName": "Frank Castle",
            "email": "frank@example.com",
            "phone": "+91 98765 66666",
            "password": "Password123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["full_name"] == "Frank Castle"
    assert data["user"]["email"] == "frank@example.com"


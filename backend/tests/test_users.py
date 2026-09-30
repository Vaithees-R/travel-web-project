def test_user_can_read_own_profile(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Fiona Gallagher",
            "email": "fiona@example.com",
            "phone": "+91 98765 66666",
            "password": "Password123!",
        },
    )
    token = reg.json()["access_token"]
    
    res = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "fiona@example.com"
    assert data["full_name"] == "Fiona Gallagher"
    assert data["phone"] == "+91 98765 66666"

def test_user_can_update_own_allowed_fields(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "George Clark",
            "email": "george@example.com",
            "phone": "+91 98765 77777",
            "password": "Password123!",
        },
    )
    token = reg.json()["access_token"]
    
    update_res = client.patch(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "full_name": "George W. Clark",
            "phone": "+91 99999 88888",
        },
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["full_name"] == "George W. Clark"
    assert updated_data["phone"] == "+91 99999 88888"
    assert updated_data["email"] == "george@example.com"

def test_user_cannot_modify_protected_fields(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Hannah Abbott",
            "email": "hannah@example.com",
            "phone": "+91 98765 88888",
            "password": "Password123!",
        },
    )
    token = reg.json()["access_token"]
    user_id = reg.json()["user"]["id"]
    
    # Attempting to tamper with id, role, password_hash, or email
    attempt = client.patch(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "id": "hacked_id_999",
            "role": "admin",
            "password_hash": "evil_hash",
        },
    )
    assert attempt.status_code == 422 # Pydantic extra='forbid' validation error

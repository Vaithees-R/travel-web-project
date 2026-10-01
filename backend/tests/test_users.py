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

def test_user_can_read_and_update_preferences(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Ian Malcolm",
            "email": "ian@example.com",
            "phone": "+91 98765 99999",
            "password": "Password123!",
        },
    )
    token = reg.json()["access_token"]

    # 1. Read default preferences
    get_res = client.get(
        "/api/users/me/preferences",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert get_res.status_code == 200
    prefs = get_res.json()
    assert prefs["preferred_cabin"] == "Economy"
    assert prefs["preferred_transport"] == "flight"

    # 2. Update preferences
    update_res = client.patch(
        "/api/users/me/preferences",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "preferred_cabin": "Business",
            "preferred_transport": "train",
            "preferred_seat": "Window",
            "meal_preference": "Vegetarian",
            "contact_method": "phone",
        },
    )
    assert update_res.status_code == 200
    updated_prefs = update_res.json()
    assert updated_prefs["preferred_cabin"] == "Business"
    assert updated_prefs["preferred_transport"] == "train"
    assert updated_prefs["meal_preference"] == "Vegetarian"

    # 3. Verify persistence on subsequent request
    verify_res = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["preferences"]["preferred_cabin"] == "Business"

def test_user_preferences_isolated_between_users(client):
    reg_a = client.post(
        "/api/auth/register",
        json={
            "full_name": "User Alpha",
            "email": "alpha_pref@example.com",
            "phone": "+91 91111 00000",
            "password": "Password123!",
        },
    )
    token_a = reg_a.json()["access_token"]

    # Alpha sets business cabin preference
    client.patch(
        "/api/users/me/preferences",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"preferred_cabin": "Business"},
    )

    reg_b = client.post(
        "/api/auth/register",
        json={
            "full_name": "User Beta",
            "email": "beta_pref@example.com",
            "phone": "+91 92222 00000",
            "password": "Password123!",
        },
    )
    token_b = reg_b.json()["access_token"]

    # Beta's preferences must remain default Economy
    b_res = client.get(
        "/api/users/me/preferences",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert b_res.status_code == 200
    assert b_res.json()["preferred_cabin"] == "Economy"

def test_user_password_change_flow(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Julia Roberts",
            "email": "julia@example.com",
            "phone": "+91 98765 12345",
            "password": "OldPassword123!",
        },
    )
    token = reg.json()["access_token"]

    # 1. Attempt password change with incorrect current password -> 400
    bad_current = client.post(
        "/api/users/me/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "WrongPassword!",
            "new_password": "NewSecurePassword123!",
            "confirm_password": "NewSecurePassword123!",
        },
    )
    assert bad_current.status_code == 400
    assert "incorrect" in bad_current.json()["detail"].lower()

    # 2. Attempt password change with mismatching confirm password -> 400
    mismatch = client.post(
        "/api/users/me/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "OldPassword123!",
            "new_password": "NewSecurePassword123!",
            "confirm_password": "DifferentPassword123!",
        },
    )
    assert mismatch.status_code == 400
    assert "match" in mismatch.json()["detail"].lower()

    # 3. Successful password change
    success = client.post(
        "/api/users/me/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "OldPassword123!",
            "new_password": "NewSecurePassword123!",
            "confirm_password": "NewSecurePassword123!",
        },
    )
    assert success.status_code == 200
    assert success.json()["status"] == "success"

    # 4. Old password no longer works
    login_old = client.post(
        "/api/auth/login",
        json={"email": "julia@example.com", "password": "OldPassword123!"},
    )
    assert login_old.status_code == 401

    # 5. New password works
    login_new = client.post(
        "/api/auth/login",
        json={"email": "julia@example.com", "password": "NewSecurePassword123!"},
    )
    assert login_new.status_code == 200
    assert "access_token" in login_new.json()

def test_unauthenticated_request_rejected_on_all_user_endpoints(client):
    assert client.get("/api/users/me").status_code == 401
    assert client.patch("/api/users/me", json={"full_name": "Hacker"}).status_code == 401
    assert client.get("/api/users/me/preferences").status_code == 401
    assert client.patch("/api/users/me/preferences", json={}).status_code == 401
    assert client.post("/api/users/me/change-password", json={}).status_code == 401
    assert client.request("DELETE", "/api/users/me", json={}).status_code == 401


def test_user_delete_account_danger_zone(client):
    reg = client.post(
        "/api/auth/register",
        json={
            "full_name": "Ephemeral Traveler",
            "email": "ephemeral@example.com",
            "phone": "+91 99999 44444",
            "password": "Password123!",
        },
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]

    # 1. Invalid confirmation phrase is rejected
    bad_phrase = client.request(
        "DELETE",
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"confirmation": "PLEASE_DELETE", "password": "Password123!"},
    )
    assert bad_phrase.status_code == 400
    assert "DELETE" in bad_phrase.json()["detail"]

    # 2. Incorrect password is rejected
    bad_pass = client.request(
        "DELETE",
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"confirmation": "DELETE", "password": "WrongPassword!"},
    )
    assert bad_pass.status_code == 400
    assert "password" in bad_pass.json()["detail"].lower()

    # 3. Successful deletion
    success_del = client.request(
        "DELETE",
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"confirmation": "DELETE", "password": "Password123!"},
    )
    assert success_del.status_code == 200
    assert success_del.json()["status"] == "success"

    # 4. User cannot log in anymore
    login_attempt = client.post(
        "/api/auth/login",
        json={"email": "ephemeral@example.com", "password": "Password123!"},
    )
    assert login_attempt.status_code == 401



"""Tests for authentication endpoints."""
import pytest


def test_register_and_login(client):
    # Register a new patient
    r = client.post("/api/auth/register", json={
        "email": "test_patient@example.com",
        "password": "SecurePass123!",
        "first_name": "Test",
        "last_name": "Patient",
        "role": "patient",
    })
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "test_patient@example.com"
    assert data["role"] == "patient"

    # Login
    r2 = client.post("/api/auth/login", json={
        "email": "test_patient@example.com",
        "password": "SecurePass123!",
    })
    assert r2.status_code == 200
    token_data = r2.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Get current user with token
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    r3 = client.get("/api/auth/me", headers=headers)
    assert r3.status_code == 200
    assert r3.json()["email"] == "test_patient@example.com"


def test_register_duplicate_email(client):
    # First registration
    client.post("/api/auth/register", json={
        "email": "dup@example.com",
        "password": "pass123",
        "first_name": "A",
        "last_name": "B",
        "role": "patient",
    })
    # Second registration with same email
    r = client.post("/api/auth/register", json={
        "email": "dup@example.com",
        "password": "pass456",
        "first_name": "C",
        "last_name": "D",
        "role": "patient",
    })
    assert r.status_code == 400


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrong_pw@example.com",
        "password": "rightpass",
        "first_name": "A",
        "last_name": "B",
        "role": "patient",
    })
    r = client.post("/api/auth/login", json={
        "email": "wrong_pw@example.com",
        "password": "wrongpass",
    })
    assert r.status_code == 401


def test_invalid_role(client):
    r = client.post("/api/auth/register", json={
        "email": "badrole@example.com",
        "password": "pass123",
        "first_name": "A",
        "last_name": "B",
        "role": "superuser",   # invalid
    })
    assert r.status_code == 422


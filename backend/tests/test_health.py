"""Tests for health endpoints."""


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "LifeRoute" in r.json()["message"]


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


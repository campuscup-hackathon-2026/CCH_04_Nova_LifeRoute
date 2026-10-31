"""Tests for ETA service."""
from app.services.eta_service import compute_eta_seconds


def test_eta_zero_distance():
    eta = compute_eta_seconds(0, traffic_factor=1.0)
    assert eta == 30  # minimum 30 seconds


def test_eta_10km_free_flow():
    # 10 km at 60 km/h = 600 seconds = 10 minutes
    eta = compute_eta_seconds(10, traffic_factor=1.0, base_speed_kmh=60)
    assert eta == pytest.approx(600, abs=5)


def test_eta_with_traffic():
    # 10 km, factor=1.5 → effective speed = 40 km/h → 900 seconds
    eta = compute_eta_seconds(10, traffic_factor=1.5, base_speed_kmh=60)
    assert eta == pytest.approx(900, abs=5)


def test_eta_road_closed():
    # Road closed → factor=99 → very slow / minimum 30s
    eta = compute_eta_seconds(1, traffic_factor=99)
    assert eta >= 30


import pytest


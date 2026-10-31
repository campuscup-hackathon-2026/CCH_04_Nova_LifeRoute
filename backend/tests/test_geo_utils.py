"""Tests for geo utility functions."""
import math
from app.utils.geo_utils import haversine_km, bearing_degrees, interpolate_position, find_nearest_node


def test_haversine_known_distance():
    # Distance between London (51.5074, -0.1278) and Paris (48.8566, 2.3522) ≈ 340 km
    d = haversine_km(51.5074, -0.1278, 48.8566, 2.3522)
    assert 330 < d < 350, f"Expected ~340 km, got {d}"


def test_haversine_same_point():
    d = haversine_km(12.9716, 77.5946, 12.9716, 77.5946)
    assert d == pytest.approx(0.0, abs=1e-6)


def test_bearing_north():
    # Bearing from a point to a point directly north should be ~0°
    b = bearing_degrees(0, 0, 1, 0)
    assert 355 < b or b < 5, f"Expected ~0°, got {b}"


def test_interpolate_midpoint():
    lat, lon = interpolate_position(0, 0, 10, 10, 0.5)
    assert lat == pytest.approx(5.0)
    assert lon == pytest.approx(5.0)


def test_interpolate_clamping():
    lat, lon = interpolate_position(0, 0, 10, 10, 1.5)
    assert lat == pytest.approx(10.0)
    lat, lon = interpolate_position(0, 0, 10, 10, -1.0)
    assert lat == pytest.approx(0.0)


def test_find_nearest_node():
    nodes = [
        {"node_id": 1, "latitude": 12.0, "longitude": 77.0},
        {"node_id": 2, "latitude": 13.0, "longitude": 78.0},
        {"node_id": 3, "latitude": 12.5, "longitude": 77.5},
    ]
    nearest = find_nearest_node(12.1, 77.1, nodes)
    assert nearest == 1


import pytest


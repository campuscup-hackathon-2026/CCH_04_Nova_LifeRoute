"""
Geospatial utility functions.
Uses the Haversine formula for distance and bearing calculations.
"""
import math
from typing import Tuple


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return great-circle distance in kilometres between two lat/lon points."""
    R = 6371.0  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def bearing_degrees(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return compass bearing (0–360°) from point 1 to point 2."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dlambda = math.radians(lon2 - lon1)
    x = math.sin(dlambda) * math.cos(phi2)
    y = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(dlambda)
    theta = math.atan2(x, y)
    return (math.degrees(theta) + 360) % 360


def interpolate_position(
    lat1: float, lon1: float,
    lat2: float, lon2: float,
    fraction: float,
) -> Tuple[float, float]:
    """
    Linearly interpolate between two geographic points.
    fraction=0 → point 1, fraction=1 → point 2.
    Good enough for short distances (< 10 km).
    """
    fraction = max(0.0, min(1.0, fraction))
    return (
        lat1 + (lat2 - lat1) * fraction,
        lon1 + (lon2 - lon1) * fraction,
    )


def find_nearest_node(lat: float, lon: float, nodes: list) -> int:
    """
    Find the node_id of the node nearest to the given lat/lon.
    nodes: list of dicts with keys node_id, latitude, longitude.
    """
    best_id = None
    best_dist = float("inf")
    for node in nodes:
        d = haversine_km(lat, lon, float(node["latitude"]), float(node["longitude"]))
        if d < best_dist:
            best_dist = d
            best_id = node["node_id"]
    return best_id


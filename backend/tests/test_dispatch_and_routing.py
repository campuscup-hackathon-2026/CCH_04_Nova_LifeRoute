"""Tests for routing and dispatch services."""
from datetime import datetime
from app.database import models
from app.services.routing_service import build_graph, find_shortest_path, _fallback_route
from app.services.dispatch_service import find_available_ambulances, rank_ambulances_by_eta, dispatch_ambulance


def test_fallback_route():
    # Between Bangalore center and Whitefield
    route = _fallback_route(12.9716, 77.5946, 12.9698, 77.7500)
    assert route["is_fallback"] is True
    assert route["total_distance_km"] > 10.0
    assert route["estimated_duration_seconds"] > 60


def test_road_graph_routing(db):
    # Create sample road nodes and edges
    node1 = models.RoadNode(node_id=101, name="Station A", latitude=12.9710, longitude=77.5900, is_active=True)
    node2 = models.RoadNode(node_id=102, name="Junction B", latitude=12.9750, longitude=77.5950, is_active=True)
    node3 = models.RoadNode(node_id=103, name="Hospital C", latitude=12.9800, longitude=77.6000, is_active=True)
    db.add_all([node1, node2, node3])

    edge1 = models.RoadEdge(edge_id=201, from_node_id=101, to_node_id=102, distance_km=1.2, base_speed_kmh=60, is_bidirectional=True, is_active=True)
    edge2 = models.RoadEdge(edge_id=202, from_node_id=102, to_node_id=103, distance_km=1.5, base_speed_kmh=60, is_bidirectional=True, is_active=True)
    db.add_all([edge1, edge2])
    db.commit()

    G, nodes_dict = build_graph(db)
    result = find_shortest_path(G, nodes_dict, 12.9710, 77.5900, 12.9800, 77.6000)

    assert result is not None
    assert result["path_node_ids"] == [101, 102, 103]
    assert result["total_distance_km"] == 2.7
    assert result["estimated_duration_seconds"] > 0


def test_dispatch_selection(db):
    # Create available ambulance
    amb1 = models.Ambulance(
        registration_number="KA-01-AMB-99",
        vehicle_type="ALS",
        is_available=True,
        status="available",
        current_latitude=12.9716,
        current_longitude=77.5946,
    )
    db.add(amb1)
    db.commit()

    # Create emergency request
    req = models.EmergencyRequest(
        patient_latitude=12.9730,
        patient_longitude=77.5960,
        emergency_type="cardiac",
        severity="critical",
        status="pending",
    )
    db.add(req)
    db.commit()

    assignment = dispatch_ambulance(db, req)
    assert assignment is not None
    assert assignment.ambulance_id == amb1.ambulance_id
    assert assignment.status == "assigned"

    # Verify ambulance is now marked dispatched
    db.refresh(amb1)
    assert amb1.is_available is False
    assert amb1.status == "dispatched"


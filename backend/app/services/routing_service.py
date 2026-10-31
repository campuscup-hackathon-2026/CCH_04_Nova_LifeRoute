"""
Routing service — builds a NetworkX graph from ROAD_NODES and ROAD_EDGES,
then finds shortest paths using Dijkstra's algorithm.

Traffic incidents are applied as edge-weight penalties.
Road closures result in edge removal during pathfinding.

[SIMULATION NOTE] Road graph data is simulated/demo data.
"""
from __future__ import annotations

from typing import List, Optional, Dict, Tuple
import math

import networkx as nx
from sqlalchemy.orm import Session

from app.database import models
from app.utils.geo_utils import haversine_km, find_nearest_node


def build_graph(db: Session) -> Tuple[nx.DiGraph, Dict[int, dict]]:
    """
    Load all active nodes and edges from the database and build a NetworkX DiGraph.
    Returns (graph, nodes_dict) where nodes_dict maps node_id → {lat, lon, name}.
    """
    G = nx.DiGraph()

    nodes = db.query(models.RoadNode).filter(models.RoadNode.is_active == True).all()
    nodes_dict: Dict[int, dict] = {}
    for n in nodes:
        G.add_node(n.node_id, lat=float(n.latitude), lon=float(n.longitude), name=n.name)
        nodes_dict[n.node_id] = {
            "node_id": n.node_id,
            "latitude": float(n.latitude),
            "longitude": float(n.longitude),
            "name": n.name,
        }

    # Get active incidents for penalty calculation
    active_incidents = {
        i.edge_id: i
        for i in db.query(models.TrafficIncident).filter(models.TrafficIncident.is_active == True).all()
        if i.edge_id is not None
    }

    edges = db.query(models.RoadEdge).filter(models.RoadEdge.is_active == True).all()
    for e in edges:
        incident = active_incidents.get(e.edge_id)

        # Skip closed roads
        if incident and incident.is_road_closed:
            continue

        base_speed = float(e.base_speed_kmh or 60.0)
        dist_km = float(e.distance_km)

        # Apply traffic penalty
        if incident:
            reduction = float(incident.speed_reduction_pct or 0) / 100.0
            effective_speed = base_speed * (1 - reduction)
        else:
            effective_speed = base_speed

        # Weight = travel time in seconds
        travel_seconds = (dist_km / max(effective_speed, 1.0)) * 3600

        G.add_edge(e.from_node_id, e.to_node_id, weight=travel_seconds, dist_km=dist_km, edge_id=e.edge_id)
        if e.is_bidirectional:
            G.add_edge(e.to_node_id, e.from_node_id, weight=travel_seconds, dist_km=dist_km, edge_id=e.edge_id)

    return G, nodes_dict


def find_shortest_path(
    G: nx.DiGraph,
    nodes_dict: Dict[int, dict],
    from_lat: float,
    from_lon: float,
    to_lat: float,
    to_lon: float,
) -> Optional[dict]:
    """
    Find the shortest path (by travel time) from the nearest node to from_lat/lon
    to the nearest node to to_lat/lon.

    Returns a dict with:
        path_node_ids, total_distance_km, estimated_duration_seconds, path_nodes
    Returns None if no path exists or graph is empty.
    """
    if not nodes_dict:
        return _fallback_route(from_lat, from_lon, to_lat, to_lon)

    node_list = list(nodes_dict.values())
    src = find_nearest_node(from_lat, from_lon, node_list)
    dst = find_nearest_node(to_lat, to_lon, node_list)

    if src is None or dst is None:
        return _fallback_route(from_lat, from_lon, to_lat, to_lon)

    if src == dst:
        dist_km = haversine_km(from_lat, from_lon, to_lat, to_lon)
        return {
            "path_node_ids": [src],
            "total_distance_km": dist_km,
            "estimated_duration_seconds": max(30, int(dist_km / 50 * 3600)),
            "path_nodes": [nodes_dict[src]],
        }

    try:
        path = nx.shortest_path(G, source=src, target=dst, weight="weight")
    except nx.NetworkXNoPath:
        return _fallback_route(from_lat, from_lon, to_lat, to_lon)
    except nx.NodeNotFound:
        return _fallback_route(from_lat, from_lon, to_lat, to_lon)

    # Calculate totals
    total_dist = 0.0
    total_time = 0.0
    for i in range(len(path) - 1):
        edge_data = G.get_edge_data(path[i], path[i + 1])
        total_dist += edge_data.get("dist_km", 0)
        total_time += edge_data.get("weight", 0)

    return {
        "path_node_ids": path,
        "total_distance_km": round(total_dist, 3),
        "estimated_duration_seconds": int(total_time),
        "path_nodes": [nodes_dict[nid] for nid in path if nid in nodes_dict],
    }


def _fallback_route(from_lat: float, from_lon: float, to_lat: float, to_lon: float) -> dict:
    """Fallback when no road graph data is available — uses straight-line estimate."""
    dist_km = haversine_km(from_lat, from_lon, to_lat, to_lon)
    duration = max(60, int(dist_km / 50 * 3600 * 1.3))   # 30% urban penalty
    return {
        "path_node_ids": [],
        "total_distance_km": round(dist_km, 3),
        "estimated_duration_seconds": duration,
        "path_nodes": [],
        "is_fallback": True,
    }


def save_route_version(
    db: Session,
    trip_id: int,
    route_type: str,
    route_result: dict,
    reroute_reason: Optional[str] = None,
) -> models.RouteVersion:
    """Persist a route version and its segments to the database."""
    # Mark previous versions as not current
    db.query(models.RouteVersion).filter(
        models.RouteVersion.trip_id == trip_id,
        models.RouteVersion.route_type == route_type,
        models.RouteVersion.is_current == True,
    ).update({"is_current": False})

    last = (
        db.query(models.RouteVersion)
        .filter(models.RouteVersion.trip_id == trip_id, models.RouteVersion.route_type == route_type)
        .count()
    )

    version = models.RouteVersion(
        trip_id=trip_id,
        version_number=last + 1,
        route_type=route_type,
        total_distance_km=route_result["total_distance_km"],
        estimated_duration_seconds=route_result["estimated_duration_seconds"],
        reroute_reason=reroute_reason,
        is_current=True,
    )
    db.add(version)
    db.flush()

    # Save segments
    path_ids = route_result.get("path_node_ids", [])
    for i in range(len(path_ids) - 1):
        seg = models.RouteSegment(
            version_id=version.version_id,
            sequence_order=i + 1,
            from_node_id=path_ids[i],
            to_node_id=path_ids[i + 1],
            distance_km=0,
            estimated_duration_seconds=0,
        )
        db.add(seg)

    db.commit()
    db.refresh(version)
    return version


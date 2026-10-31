"""
WebSocket ambulance tracking service.

Manages in-memory WebSocket connections per ambulance.
Broadcasts simulated location updates to all connected clients.

[SIMULATION NOTE] Location updates are simulated — not real GPS.
"""
from __future__ import annotations

import asyncio
import json
import math
from typing import Dict, List
from datetime import datetime

from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections for ambulance tracking."""

    def __init__(self):
        # ambulance_id → list of connected WebSocket clients
        self.active: Dict[int, List[WebSocket]] = {}

    async def connect(self, ambulance_id: int, websocket: WebSocket):
        await websocket.accept()
        if ambulance_id not in self.active:
            self.active[ambulance_id] = []
        self.active[ambulance_id].append(websocket)

    def disconnect(self, ambulance_id: int, websocket: WebSocket):
        if ambulance_id in self.active:
            self.active[ambulance_id].discard(websocket) if hasattr(self.active[ambulance_id], 'discard') else None
            try:
                self.active[ambulance_id].remove(websocket)
            except ValueError:
                pass

    async def broadcast(self, ambulance_id: int, message: dict):
        """Send a JSON message to all clients tracking this ambulance."""
        if ambulance_id not in self.active:
            return
        dead = []
        for ws in self.active[ambulance_id]:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(ws)
        for ws in dead:
            try:
                self.active[ambulance_id].remove(ws)
            except ValueError:
                pass

    async def send_location_update(
        self,
        ambulance_id: int,
        lat: float,
        lon: float,
        speed_kmh: float = 0,
        heading: float = 0,
        status: str = "en_route",
        eta_seconds: int = 0,
    ):
        payload = {
            "type": "location_update",
            "ambulance_id": ambulance_id,
            "latitude": lat,
            "longitude": lon,
            "speed_kmh": speed_kmh,
            "heading": heading,
            "status": status,
            "eta_seconds": eta_seconds,
            "timestamp": datetime.utcnow().isoformat(),
            "is_simulated": True,
        }
        await self.broadcast(ambulance_id, payload)


# Singleton connection manager
manager = ConnectionManager()


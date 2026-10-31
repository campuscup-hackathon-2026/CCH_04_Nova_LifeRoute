"""WebSocket tracking router — real-time ambulance location streaming."""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.tracking_service import manager

router = APIRouter()


@router.websocket("/ambulances/{ambulance_id}")
async def ambulance_tracking(websocket: WebSocket, ambulance_id: int):
    """
    WebSocket endpoint for live ambulance tracking.
    Connect to receive location updates for a specific ambulance.

    [SIMULATION] Location updates are simulated during demo mode.

    Usage: ws://localhost:8000/ws/ambulances/{ambulance_id}
    """
    await manager.connect(ambulance_id, websocket)
    try:
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connected",
            "ambulance_id": ambulance_id,
            "message": f"Tracking ambulance {ambulance_id}",
            "is_simulated": True,
        }))
        # Keep connection alive — receive pings from client
        while True:
            data = await websocket.receive_text()
            # Echo ping back
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        manager.disconnect(ambulance_id, websocket)


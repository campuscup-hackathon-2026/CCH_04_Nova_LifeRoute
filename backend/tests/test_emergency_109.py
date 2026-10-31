"""Tests for Emergency 109 hotline call ingestion."""
from app.database import models


def test_call_109_endpoint(client, db):
    # Setup test ambulance
    amb = models.Ambulance(
        registration_number="109-AMB-01",
        vehicle_type="ALS",
        is_available=True,
        status="available",
        current_latitude=12.9716,
        current_longitude=77.5946,
    )
    db.add(amb)
    db.commit()

    # Simulate dial 109 call
    response = client.post("/api/emergencies/call-109", json={
        "caller_phone": "+91 98765 00109",
        "caller_name": "Emergency Citizen",
        "patient_latitude": 12.9750,
        "patient_longitude": 77.5960,
        "emergency_type": "severe_accident",
        "severity": "critical",
        "voice_transcript": "Caller reported multi-vehicle collision near MG Road",
    })

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["channel"] == "HOTLINE_109"
    assert data["caller_phone"] == "+91 98765 00109"
    assert data["assigned_ambulance_id"] == amb.ambulance_id
    assert data["assignment_id"] is not None


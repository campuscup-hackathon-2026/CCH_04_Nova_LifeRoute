"""Tests for hospital recommendation service."""
from app.database import models
from app.services.hospital_service import recommend_hospitals


def test_hospital_recommendation(db):
    # Setup test hospitals
    h1 = models.Hospital(
        name="City General Hospital",
        latitude=12.9750,
        longitude=77.5950,
        total_beds=100,
        available_beds=25,
        icu_beds=10,
        available_icu_beds=3,
        is_active=True,
        is_verified=True,
    )
    h2 = models.Hospital(
        name="Far Suburban Clinic",
        latitude=13.1500,
        longitude=77.8000,
        total_beds=50,
        available_beds=5,
        icu_beds=2,
        available_icu_beds=0,
        is_active=True,
        is_verified=True,
    )
    db.add_all([h1, h2])
    db.commit()

    # Add service to h1
    s1 = models.HospitalService(hospital_id=h1.hospital_id, service_name="Cardiac Care", is_available=True)
    db.add(s1)
    db.commit()

    req = models.EmergencyRequest(
        patient_latitude=12.9716,
        patient_longitude=77.5946,
        emergency_type="cardiac",
        severity="high",
        status="pending",
    )
    db.add(req)
    db.commit()

    recs = recommend_hospitals(db, req, required_service="Cardiac", need_icu=True, top_n=5)
    assert len(recs) >= 1
    # h1 is closer and has available ICU beds, so should be top rank
    assert recs[0].hospital_id == h1.hospital_id
    assert recs[0].rank == 1
    assert recs[0].is_selected is True


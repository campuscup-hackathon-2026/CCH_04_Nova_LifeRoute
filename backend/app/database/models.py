"""
SQLAlchemy ORM models matching the existing Neon PostgreSQL schema.

IMPORTANT:
- These models are READ-ONLY in terms of schema — do NOT call Base.metadata.create_all()
- All table and column names are lowercase (PostgreSQL default for unquoted identifiers)
- Primary keys, foreign keys, and nullable flags match the original SQL schema
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    BigInteger, Boolean, Column, DateTime, ForeignKey,
    Integer, Numeric, String, Text, Float, CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database.connection import Base


# ─── 1. USERS ────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)   # patient | driver | admin | hospital_staff
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="user", uselist=False)
    driver = relationship("Driver", back_populates="user", uselist=False)
    hospital_users = relationship("HospitalUser", back_populates="user")


# ─── 2. PATIENTS ─────────────────────────────────────────────────────────────

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True)
    date_of_birth = Column(DateTime)
    blood_type = Column(String(5))
    medical_history = Column(Text)
    emergency_contact_name = Column(String(200))
    emergency_contact_phone = Column(String(20))
    home_latitude = Column(Numeric(10, 8))
    home_longitude = Column(Numeric(11, 8))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="patient")
    emergency_requests = relationship("EmergencyRequest", back_populates="patient")


# ─── 3. DRIVERS ──────────────────────────────────────────────────────────────

class Driver(Base):
    __tablename__ = "drivers"

    driver_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True)
    license_number = Column(String(50), unique=True)
    license_expiry = Column(DateTime)
    is_available = Column(Boolean, default=False)
    current_latitude = Column(Numeric(10, 8))
    current_longitude = Column(Numeric(11, 8))
    rating = Column(Numeric(3, 2), default=Decimal("0.00"))
    total_trips = Column(Integer, default=0)
    status = Column(String(50), default="offline")  # online | offline | on_trip
    station_id = Column(Integer, ForeignKey("stations.station_id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="driver")
    station = relationship("Station", back_populates="drivers")
    ambulances = relationship("Ambulance", back_populates="driver")
    dispatch_assignments = relationship("DispatchAssignment", back_populates="driver")


# ─── 4. STATIONS ─────────────────────────────────────────────────────────────

class Station(Base):
    __tablename__ = "stations"

    station_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    address = Column(Text)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    contact_phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    drivers = relationship("Driver", back_populates="station")
    ambulances = relationship("Ambulance", back_populates="station")


# ─── 5. AMBULANCES ───────────────────────────────────────────────────────────

class Ambulance(Base):
    __tablename__ = "ambulances"

    ambulance_id = Column(Integer, primary_key=True, autoincrement=True)
    registration_number = Column(String(50), unique=True, nullable=False)
    vehicle_type = Column(String(100))    # BLS | ALS | ICU | Neonatal
    equipment = Column(Text)             # JSON string of equipment list
    is_available = Column(Boolean, default=True)
    status = Column(String(50), default="available")  # available | dispatched | maintenance | offline
    driver_id = Column(Integer, ForeignKey("drivers.driver_id", ondelete="SET NULL"), nullable=True)
    station_id = Column(Integer, ForeignKey("stations.station_id", ondelete="SET NULL"), nullable=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id", ondelete="SET NULL"), nullable=True)
    current_latitude = Column(Numeric(10, 8))
    current_longitude = Column(Numeric(11, 8))
    last_maintenance = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    driver = relationship("Driver", back_populates="ambulances")
    station = relationship("Station", back_populates="ambulances")
    hospital = relationship("Hospital", back_populates="ambulances")
    locations = relationship("AmbulanceLocation", back_populates="ambulance")
    dispatch_assignments = relationship("DispatchAssignment", back_populates="ambulance")


# ─── 6. AMBULANCE_LOCATIONS ──────────────────────────────────────────────────

class AmbulanceLocation(Base):
    __tablename__ = "ambulance_locations"

    location_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ambulance_id = Column(Integer, ForeignKey("ambulances.ambulance_id", ondelete="CASCADE"))
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    speed_kmh = Column(Numeric(5, 2))
    heading = Column(Numeric(5, 2))
    recorded_at = Column(DateTime, default=datetime.utcnow)
    is_simulated = Column(Boolean, default=True)

    ambulance = relationship("Ambulance", back_populates="locations")


# ─── 7. EMERGENCY_REQUESTS ───────────────────────────────────────────────────

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    request_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id", ondelete="SET NULL"), nullable=True)
    patient_latitude = Column(Numeric(10, 8), nullable=False)
    patient_longitude = Column(Numeric(11, 8), nullable=False)
    patient_address = Column(Text)
    emergency_type = Column(String(100))      # cardiac | trauma | respiratory | etc.
    severity = Column(String(50))             # critical | high | medium | low
    notes = Column(Text)
    status = Column(String(50), default="pending")  # pending | dispatched | en_route | completed | cancelled
    requested_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_simulated = Column(Boolean, default=False)

    patient = relationship("Patient", back_populates="emergency_requests")
    dispatch_assignments = relationship("DispatchAssignment", back_populates="emergency_request")
    hospital_recommendations = relationship("HospitalRecommendation", back_populates="emergency_request")
    trips = relationship("Trip", back_populates="emergency_request")


# ─── 8. DISPATCH_ASSIGNMENTS ─────────────────────────────────────────────────

class DispatchAssignment(Base):
    __tablename__ = "dispatch_assignments"

    assignment_id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("emergency_requests.request_id", ondelete="CASCADE"))
    ambulance_id = Column(Integer, ForeignKey("ambulances.ambulance_id", ondelete="SET NULL"), nullable=True)
    driver_id = Column(Integer, ForeignKey("drivers.driver_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="assigned")   # assigned | accepted | rejected | completed | cancelled
    assigned_at = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime)
    completed_at = Column(DateTime)
    estimated_arrival_seconds = Column(Integer)
    actual_arrival_seconds = Column(Integer)
    rejection_reason = Column(Text)
    notes = Column(Text)

    emergency_request = relationship("EmergencyRequest", back_populates="dispatch_assignments")
    ambulance = relationship("Ambulance", back_populates="dispatch_assignments")
    driver = relationship("Driver", back_populates="dispatch_assignments")


# ─── 9. HOSPITALS ────────────────────────────────────────────────────────────

class Hospital(Base):
    __tablename__ = "hospitals"

    hospital_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    address = Column(Text)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    contact_phone = Column(String(20))
    total_beds = Column(Integer, default=0)
    available_beds = Column(Integer, default=0)
    icu_beds = Column(Integer, default=0)
    available_icu_beds = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    services = relationship("HospitalService", back_populates="hospital")
    ambulances = relationship("Ambulance", back_populates="hospital")
    recommendations = relationship("HospitalRecommendation", back_populates="hospital")
    hospital_users = relationship("HospitalUser", back_populates="hospital")


# ─── 10. HOSPITAL_SERVICES ───────────────────────────────────────────────────

class HospitalService(Base):
    __tablename__ = "hospital_services"

    service_id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id", ondelete="CASCADE"))
    service_name = Column(String(200), nullable=False)
    is_available = Column(Boolean, default=True)
    notes = Column(Text)

    hospital = relationship("Hospital", back_populates="services")


# ─── 11. HOSPITAL_RECOMMENDATIONS ────────────────────────────────────────────

class HospitalRecommendation(Base):
    __tablename__ = "hospital_recommendations"

    recommendation_id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("emergency_requests.request_id", ondelete="CASCADE"))
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id", ondelete="SET NULL"), nullable=True)
    rank = Column(Integer)
    score = Column(Numeric(5, 4))
    estimated_travel_seconds = Column(Integer)
    reason = Column(Text)
    is_selected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    emergency_request = relationship("EmergencyRequest", back_populates="hospital_recommendations")
    hospital = relationship("Hospital", back_populates="recommendations")


# ─── 12. TRIPS ───────────────────────────────────────────────────────────────

class Trip(Base):
    __tablename__ = "trips"

    trip_id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("emergency_requests.request_id", ondelete="SET NULL"), nullable=True)
    assignment_id = Column(Integer, ForeignKey("dispatch_assignments.assignment_id", ondelete="SET NULL"), nullable=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="in_progress")  # in_progress | completed | cancelled
    pickup_latitude = Column(Numeric(10, 8))
    pickup_longitude = Column(Numeric(11, 8))
    dropoff_latitude = Column(Numeric(10, 8))
    dropoff_longitude = Column(Numeric(11, 8))
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    total_distance_km = Column(Numeric(8, 3))
    total_duration_seconds = Column(Integer)
    is_simulated = Column(Boolean, default=False)
    notes = Column(Text)

    emergency_request = relationship("EmergencyRequest", back_populates="trips")
    route_versions = relationship("RouteVersion", back_populates="trip")
    eta_predictions = relationship("ETAPrediction", back_populates="trip")


# ─── 13. ROAD_NODES ──────────────────────────────────────────────────────────

class RoadNode(Base):
    __tablename__ = "road_nodes"

    node_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200))
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    node_type = Column(String(50))   # intersection | junction | waypoint
    is_active = Column(Boolean, default=True)

    edges_from = relationship("RoadEdge", foreign_keys="RoadEdge.from_node_id", back_populates="from_node")
    edges_to = relationship("RoadEdge", foreign_keys="RoadEdge.to_node_id", back_populates="to_node")


# ─── 14. ROAD_EDGES ──────────────────────────────────────────────────────────

class RoadEdge(Base):
    __tablename__ = "road_edges"

    edge_id = Column(Integer, primary_key=True, autoincrement=True)
    from_node_id = Column(Integer, ForeignKey("road_nodes.node_id", ondelete="CASCADE"))
    to_node_id = Column(Integer, ForeignKey("road_nodes.node_id", ondelete="CASCADE"))
    distance_km = Column(Numeric(8, 3), nullable=False)
    base_speed_kmh = Column(Numeric(5, 2), default=Decimal("60.00"))
    road_type = Column(String(50))     # highway | arterial | local
    is_bidirectional = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

    from_node = relationship("RoadNode", foreign_keys=[from_node_id], back_populates="edges_from")
    to_node = relationship("RoadNode", foreign_keys=[to_node_id], back_populates="edges_to")


# ─── 15. TRAFFIC_INCIDENTS ───────────────────────────────────────────────────

class TrafficIncident(Base):
    __tablename__ = "traffic_incidents"

    incident_id = Column(Integer, primary_key=True, autoincrement=True)
    edge_id = Column(Integer, ForeignKey("road_edges.edge_id", ondelete="CASCADE"), nullable=True)
    incident_type = Column(String(100))    # road_closure | accident | congestion
    severity = Column(String(50))          # low | medium | high | critical
    speed_reduction_pct = Column(Numeric(5, 2), default=Decimal("0.00"))
    is_road_closed = Column(Boolean, default=False)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    description = Column(Text)
    reported_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    is_simulated = Column(Boolean, default=True)


# ─── 16. ROUTE_VERSIONS ──────────────────────────────────────────────────────

class RouteVersion(Base):
    __tablename__ = "route_versions"

    version_id = Column(Integer, primary_key=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.trip_id", ondelete="CASCADE"))
    version_number = Column(Integer, default=1)
    route_type = Column(String(50))   # ambulance_to_patient | patient_to_hospital
    total_distance_km = Column(Numeric(8, 3))
    estimated_duration_seconds = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    reroute_reason = Column(Text)
    is_current = Column(Boolean, default=True)

    trip = relationship("Trip", back_populates="route_versions")
    segments = relationship("RouteSegment", back_populates="route_version")


# ─── 17. ROUTE_SEGMENTS ──────────────────────────────────────────────────────

class RouteSegment(Base):
    __tablename__ = "route_segments"

    segment_id = Column(Integer, primary_key=True, autoincrement=True)
    version_id = Column(Integer, ForeignKey("route_versions.version_id", ondelete="CASCADE"))
    sequence_order = Column(Integer, nullable=False)
    from_node_id = Column(Integer, ForeignKey("road_nodes.node_id"))
    to_node_id = Column(Integer, ForeignKey("road_nodes.node_id"))
    distance_km = Column(Numeric(8, 3))
    estimated_duration_seconds = Column(Integer)

    route_version = relationship("RouteVersion", back_populates="segments")


# ─── 18. ETA_PREDICTIONS ─────────────────────────────────────────────────────

class ETAPrediction(Base):
    __tablename__ = "eta_predictions"

    prediction_id = Column(Integer, primary_key=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.trip_id", ondelete="CASCADE"), nullable=True)
    ambulance_id = Column(Integer, ForeignKey("ambulances.ambulance_id", ondelete="SET NULL"), nullable=True)
    predicted_seconds = Column(Integer)
    actual_seconds = Column(Integer)
    distance_km = Column(Numeric(8, 3))
    traffic_factor = Column(Numeric(4, 3), default=Decimal("1.000"))
    model_version = Column(String(50))
    predicted_at = Column(DateTime, default=datetime.utcnow)
    is_ml_prediction = Column(Boolean, default=False)

    trip = relationship("Trip", back_populates="eta_predictions")


# ─── 19. HOSPITAL_USERS ──────────────────────────────────────────────────────

class HospitalUser(Base):
    __tablename__ = "hospital_users"

    hospital_user_id = Column(Integer, primary_key=True, autoincrement=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    role_in_hospital = Column(String(100))   # admin | staff | doctor | nurse
    is_active = Column(Boolean, default=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="hospital_users")
    user = relationship("User", back_populates="hospital_users")


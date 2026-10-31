# 🚑 LifeRoute / SmartPulse AI — Intelligent Ambulance Dispatch & Emergency Response System

An end-to-end intelligent emergency response platform built for hackathons, featuring a modern **React + TypeScript + Vite + Tailwind CSS** frontend and a **Python FastAPI + Neon PostgreSQL + NetworkX** backend.

---

## 🌟 System Overview

LifeRoute accelerates emergency dispatch and patient transport through intelligent routing and hospital matching:
1. **Emergency SOS Intake**: Instant geolocation detection and severity classification.
2. **ETA-Based Dispatch**: Ranks and assigns the closest available ambulance by estimated travel time (not just straight-line distance).
3. **Shortest-Path Routing**: Graph-based path calculation (NetworkX Dijkstra) across road networks with dynamic incident penalties.
4. **Dynamic Rerouting**: Automatic route recalculation when simulated traffic congestion or road closures are detected.
5. **Hospital Recommendation Engine**: Decision-support scoring based on required clinical services, available general/ICU bed capacity, and real-time travel time.
6. **Live Simulation & Tracking**: WebSocket-based ambulance tracking with real-time ETA updates.

---

## 📁 Repository Structure

```
hackthon/
├── frontend/               # Complete React 18 + TypeScript + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/     # Reusable UI cards, SOS button, maps, toasts
│   │   ├── dashboards/     # Patient, Driver, Hospital, Admin dashboards
│   │   ├── layouts/        # DashboardLayout, PublicLayout
│   │   ├── pages/          # Landing, Login, Register, Forgot Password, Tracking
│   │   ├── services/       # Typed API clients (Axios) ready for FastAPI
│   │   ├── store/          # Zustand state management
│   │   └── types/          # Full TypeScript domain models
│   └── README.md           # Detailed frontend documentation
│
├── backend/                # Python FastAPI + Neon PostgreSQL backend
│   ├── app/
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── core/           # Config, bcrypt/JWT security, dependencies
│   │   ├── database/       # Connection pool & SQLAlchemy models for 19 tables
│   │   ├── schemas/        # Pydantic request/response validation
│   │   ├── routers/        # Auth, Users, Ambulances, Emergencies, Dispatch,
│   │   │                   # Hospitals, Routes, Traffic, Trips, Simulation, Tracking
│   │   ├── services/       # Dispatch, Dijkstra routing, Hospital scoring, ETA, WS tracking
│   │   └── utils/          # Haversine distance, bearing, geospatial tools
│   ├── tests/              # Pytest test suite (20 unit & integration tests)
│   ├── .env.example        # Environment variable template
│   ├── requirements.txt    # Python package dependencies
│   └── README.md           # Detailed backend documentation
│
└── README.md               # Main project README
```

---

## 🚀 Quick Start Guide

### 1. Frontend Setup

The frontend dev server runs at `http://localhost:3000`:

```bash
cd frontend
npm install
npm run dev
```

Key features:
- **Landing Page**: Emergency CTA, services overview, how it works, live stats.
- **Patient Dashboard**: One-click SOS dispatch, geolocation detection, active status tracking.
- **Driver Dashboard**: Status toggle (online/offline), incoming emergency accepts/rejects, navigation view.
- **Hospital Dashboard**: Fleet status, ICU/general bed capacity manager, incoming patient notices.
- **Admin Dashboard**: System-wide fleet map, verification queues, traffic simulation controls.

---

### 2. Backend Setup

The backend runs on Python 3.11+ at `http://localhost:8000`:

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Set your Neon PostgreSQL connection string in `backend/.env`:
```ini
DATABASE_URL=postgresql+psycopg://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
SECRET_KEY=generate-with-openssl-rand-hex-32
```

Start the FastAPI backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Database Health Check**: `http://localhost:8000/api/health/db`

---

## 🧪 Testing

The backend includes a comprehensive 20-test automated suite using in-memory SQLite fixtures (no live DB connection required):

```bash
cd backend
python -m pytest tests/ -v
```

All 20 tests verify:
- User registration, duplicate checks, login, and JWT validation.
- Shortest-path routing, road graph resolution, and fallback straight-line calculation.
- ETA-based ambulance dispatch and atomic status transitions.
- Multi-criteria hospital recommendation scoring (ETA + bed availability + service match).
- Traffic factor and road closure calculations.
- Geospatial math (Haversine distance, compass bearing, midpoint interpolation).

---

## 🗄️ Database Architecture (Neon PostgreSQL)

Compatible with the 19 pre-existing tables in Neon:
1. `users`
2. `patients`
3. `drivers`
4. `stations`
5. `ambulances`
6. `ambulance_locations`
7. `emergency_requests`
8. `dispatch_assignments`
9. `hospitals`
10. `hospital_services`
11. `hospital_recommendations`
12. `trips`
13. `road_nodes`
14. `road_edges`
15. `traffic_incidents`
16. `route_versions`
17. `route_segments`
18. `eta_predictions`
19. `hospital_users`

> **Note**: Database operations strictly respect existing tables and sample records. No tables are dropped or overwritten.

---

## ⚠️ Hackathon Disclaimer

LifeRoute is a hackathon prototype for demonstration and educational purposes. Hospital recommendations provide decision support and do not replace professional medical triage or guarantee hospital admission. Ambulance tracking, traffic congestion, and road closures in demo mode are simulated and clearly marked with `is_simulated: true`.

# LifeRoute Backend

**Intelligent Ambulance Dispatch & Hospital Recommendation API**

Built with FastAPI + SQLAlchemy + Neon PostgreSQL for the LifeRoute hackathon project.

---

## Quick Start

### 1. Prerequisites
- Python 3.11+
- A Neon PostgreSQL database with the LifeRoute schema already applied

### 2. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your real Neon connection string:

```
DATABASE_URL=postgresql+psycopg://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
SECRET_KEY=generate-with-openssl-rand-hex-32
```

### 4. Run the server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/api/health
- **DB Health**: http://localhost:8000/api/health/db

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── core/
│   │   ├── config.py            # Pydantic Settings (reads .env)
│   │   ├── security.py          # JWT + bcrypt helpers
│   │   └── dependencies.py      # get_current_user, role guards
│   ├── database/
│   │   ├── connection.py        # SQLAlchemy engine, SessionLocal, get_db
│   │   └── models.py            # ORM models for all 19 tables
│   ├── schemas/                 # Pydantic request/response models
│   │   ├── user.py
│   │   ├── ambulance.py
│   │   ├── emergency.py
│   │   ├── hospital.py
│   │   ├── route.py
│   │   └── dispatch.py
│   ├── routers/                 # FastAPI route handlers
│   │   ├── auth.py              # POST /api/auth/register, /login, GET /me
│   │   ├── users.py             # GET/PATCH/DELETE /api/users
│   │   ├── ambulances.py        # GET/PATCH /api/ambulances
│   │   ├── emergencies.py       # POST/GET /api/emergencies
│   │   ├── dispatch.py          # POST /api/dispatch/emergency/{id}
│   │   ├── hospitals.py         # GET /api/hospitals, POST /recommend
│   │   ├── routes.py            # POST /api/routes/calculate
│   │   ├── traffic.py           # GET/POST /api/traffic
│   │   ├── trips.py             # GET/POST /api/trips
│   │   ├── simulation.py        # POST /api/simulation/start, /reset
│   │   └── tracking.py          # WS /ws/ambulances/{id}
│   ├── services/                # Business logic
│   │   ├── dispatch_service.py  # ETA-based ambulance selection
│   │   ├── routing_service.py   # NetworkX graph + Dijkstra
│   │   ├── hospital_service.py  # Hospital scoring & recommendation
│   │   ├── eta_service.py       # ETA calculation (formula + optional ML)
│   │   └── tracking_service.py  # WebSocket connection manager
│   └── utils/
│       └── geo_utils.py         # Haversine, bearing, interpolation
├── tests/
│   ├── conftest.py              # SQLite test DB fixtures
│   ├── test_health.py
│   ├── test_auth.py
│   ├── test_geo_utils.py
│   └── test_eta_service.py
├── requirements.txt
├── .env.example
└── .gitignore
```

---

## API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/auth/me` | Get current user |

### Emergency Dispatch
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergencies/` | Create SOS request |
| GET | `/api/emergencies/` | List emergencies |
| POST | `/api/dispatch/emergency/{id}` | Dispatch best ambulance |
| GET | `/api/dispatch/assignments` | View assignments |

### Hospitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals/` | List hospitals |
| POST | `/api/hospitals/recommend/{request_id}` | Get ranked recommendations |

### Routing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/routes/calculate` | Compute shortest path |
| POST | `/api/routes/trips/{id}/reroute` | Dynamic rerouting |

### Simulation (Demo)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/simulation/start` | Start simulated ambulance run |
| POST | `/api/simulation/road-closure` | Simulate road closure |
| POST | `/api/simulation/reset` | Reset all simulations |

### WebSocket
```
ws://localhost:8000/ws/ambulances/{ambulance_id}
```
Connect to receive real-time (simulated) location updates.

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

Tests use an in-memory SQLite database — **no connection to Neon required**.

---

## User Roles

| Role | Access |
|------|--------|
| `patient` | Create SOS, view own history |
| `driver` | Accept/reject assignments, update location |
| `hospital_staff` | View fleet, manage ambulances |
| `admin` | Full access, simulation control |

---

## Connecting to the Frontend

The frontend at `http://localhost:3000` is pre-configured to call `http://localhost:8000/api`.

Set in `frontend/src/services/apiClient.ts`:
```typescript
baseURL: 'http://localhost:8000/api'
```

CORS is configured to allow both `http://localhost:3000` and `http://localhost:5173`.

---

## Disclaimer

> This is a **hackathon prototype**. Hospital recommendations are **decision-support only** and are not clinically validated. Ambulance locations and traffic data may be **simulated**. All simulated data is clearly labelled with `is_simulated: true` in API responses.


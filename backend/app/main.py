"""
LifeRoute Backend - Main Application Entry Point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.connection import check_db_connection
from app.routers import (
    auth,
    users,
    ambulances,
    emergencies,
    dispatch,
    hospitals,
    routes,
    traffic,
    trips,
    simulation,
    tracking,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print(f"[INFO] Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"[INFO] Checking database connection...")
    connected = await check_db_connection()
    if connected:
        print("[SUCCESS] Database connection established")
    else:
        print("[WARNING] Database connection not established. Check DATABASE_URL in .env")
    yield
    print(f"[INFO] Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## LifeRoute — Intelligent Ambulance Dispatch & Hospital Recommendation API

This is the backend for the LifeRoute emergency response system.

### Features
- JWT Authentication (Patient / Driver / Hospital Staff / Admin)
- Emergency SOS dispatch with intelligent ambulance selection
- Shortest-path routing via NetworkX (Dijkstra's algorithm)
- Dynamic rerouting on traffic incidents
- Hospital recommendation by ETA + services + capacity
- Simulated live ambulance tracking via WebSockets
- Full trip management

> **Note:** This is a hackathon prototype. Simulated data is clearly labelled.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health endpoints ──────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {"message": f"{settings.APP_NAME} is running", "version": settings.APP_VERSION, "docs": "/docs"}


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/api/health/db", tags=["Health"])
async def health_db():
    connected = await check_db_connection()
    if connected:
        return {"status": "ok", "database": "connected"}
    return JSONResponse(status_code=503, content={"status": "error", "database": "disconnected"})


# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(ambulances.router, prefix="/api/ambulances", tags=["Ambulances"])
app.include_router(emergencies.router, prefix="/api/emergencies", tags=["Emergencies"])
app.include_router(dispatch.router, prefix="/api/dispatch", tags=["Dispatch"])
app.include_router(hospitals.router, prefix="/api/hospitals", tags=["Hospitals"])
app.include_router(routes.router, prefix="/api/routes", tags=["Routes"])
app.include_router(traffic.router, prefix="/api/traffic", tags=["Traffic"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(tracking.router, prefix="/ws", tags=["WebSocket Tracking"])


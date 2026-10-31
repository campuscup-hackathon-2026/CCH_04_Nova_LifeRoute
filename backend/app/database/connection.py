"""
Database connection — SQLAlchemy engine, session factory, and health check.

Uses NullPool for Neon (serverless PostgreSQL) to avoid stale connections.
"""
import asyncio
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# NullPool avoids keeping connections open between requests (ideal for Neon serverless)
from sqlalchemy.pool import NullPool

engine = create_engine(
    settings.DATABASE_URL,
    poolclass=NullPool,
    echo=settings.DEBUG,
    connect_args={"sslmode": "require"} if "sslmode" not in settings.DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator:
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_db_connection() -> bool:
    """Async wrapper to test DB connectivity."""
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _sync_check)
        return True
    except Exception as exc:
        print(f"DB health check failed: {exc}")
        return False


def _sync_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


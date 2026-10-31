"""
Pytest configuration and shared fixtures.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.connection import get_db
from app.database.connection import Base

# Use in-memory SQLite for tests (avoids touching real Neon DB)
TEST_DATABASE_URL = "sqlite:///./test.db"

engine_test = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = SessionTest()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create all tables in the test SQLite DB."""
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def db():
    db = SessionTest()
    try:
        yield db
    finally:
        db.close()


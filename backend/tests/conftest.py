import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.config import settings
from app.db import Base
from app.deps import get_db
from app.main import app
from app.models import User

if not settings.test_database_url:
    raise RuntimeError("TEST_DATABASE_URL が .env に設定されていません")

engine = create_engine(settings.test_database_url)


@pytest.fixture(scope="session", autouse=True)
def tables():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection, join_transaction_mode="create_savepoint")
    session.add(User(name="test", email="test@example.com"))
    session.flush()
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()

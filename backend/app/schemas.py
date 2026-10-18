from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TripCreate(BaseModel):
    name: str
    start_at: datetime
    end_at: datetime
    budget: int | None = None


class TripRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    start_at: datetime
    end_at: datetime
    budget: int | None


class TripUpdate(BaseModel):
    name: str | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None
    budget: int | None = None

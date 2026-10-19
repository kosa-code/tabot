from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TripCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

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
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    start_at: datetime | None = None
    end_at: datetime | None = None
    budget: int | None = None


class PlaceCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    category: str | None = None
    opening_hours: dict | None = None


class PlaceUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    category: str | None = None
    opening_hours: dict | None = None


class PlaceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    latitude: float
    longitude: float
    category: str | None
    opening_hours: dict | None
    fetched_at: datetime


class TripPlaceCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    place_id: UUID
    stay_minutes: int = Field(default=0, ge=0)


class TripPlaceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    place_id: UUID
    visit_order: int
    stay_minutes: int
    start_time: datetime | None
    end_time: datetime | None

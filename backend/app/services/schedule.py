from datetime import timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Trip, TripPlace


def update_schedule(db: Session, trip_id: UUID) -> None:
    trip = db.get(Trip, trip_id)
    trip_places = db.scalars(
        select(TripPlace)
        .where(TripPlace.trip_id == trip_id)
        .order_by(TripPlace.visit_order)
    ).all()

    current = trip.start_at
    for trip_place in trip_places:
        trip_place.start_time = current
        current += timedelta(minutes=trip_place.stay_minutes)
        trip_place.end_time = current

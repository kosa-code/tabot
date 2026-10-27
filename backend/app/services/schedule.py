import math
from datetime import timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Place, Trip, TripPlace

EARTH_RADIUS_KM = 6371.0
WALKING_SPEED_KMH = 4.8
DETOUR_FACTOR = 1.3


def distance_km(a: Place, b: Place) -> float:
    lat1, lon1 = math.radians(a.latitude), math.radians(a.longitude)
    lat2, lon2 = math.radians(b.latitude), math.radians(b.longitude)
    h = (
        math.sin((lat2 - lat1) / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    )
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(h))


def travel_minutes(a: Place, b: Place) -> int:
    hours = distance_km(a, b) * DETOUR_FACTOR / WALKING_SPEED_KMH
    return math.ceil(hours * 60)


def update_schedule(db: Session, trip_id: UUID) -> None:
    trip = db.get(Trip, trip_id)
    trip_places = db.scalars(
        select(TripPlace)
        .where(TripPlace.trip_id == trip_id)
        .order_by(TripPlace.visit_order)
    ).all()

    current = trip.start_at
    previous_place = None
    for trip_place in trip_places:
        place = db.get(Place, trip_place.place_id)
        if previous_place is None:
            trip_place.travel_minutes = None
        else:
            trip_place.travel_minutes = travel_minutes(previous_place, place)
            current += timedelta(minutes=trip_place.travel_minutes)
        trip_place.start_time = current
        current += timedelta(minutes=trip_place.stay_minutes)
        trip_place.end_time = current
        previous_place = place

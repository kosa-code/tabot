from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models import Place, Trip, TripPlace
from app.schemas import TripPlaceCreate, TripPlaceRead

router = APIRouter(prefix="/trips/{trip_id}/places", tags=["trip_places"])


@router.post("", response_model=TripPlaceRead)
def add_trip_place(
    trip_id: UUID, payload: TripPlaceCreate, db: Session = Depends(get_db)
):
    if db.get(Trip, trip_id) is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    if db.get(Place, payload.place_id) is None:
        raise HTTPException(status_code=404, detail="Place not found")

    last_order = db.scalar(
        select(func.max(TripPlace.visit_order)).where(TripPlace.trip_id == trip_id)
    )
    trip_place = TripPlace(
        trip_id=trip_id,
        place_id=payload.place_id,
        visit_order=(last_order or 0) + 1,
        stay_minutes=payload.stay_minutes,
    )
    db.add(trip_place)
    db.commit()
    db.refresh(trip_place)
    return trip_place

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session, selectinload

from app.deps import get_db
from app.models import Place, Trip, TripPlace
from app.schemas import (
    TripPlaceCreate,
    TripPlaceList,
    TripPlaceOrder,
    TripPlaceRead,
    TripPlaceUpdate,
)
from app.services.schedule import check_constraints, update_schedule

router = APIRouter(prefix="/trips/{trip_id}/places", tags=["trip_places"])


def get_trip_place_or_404(db: Session, trip_id: UUID, trip_place_id: UUID) -> TripPlace:
    trip_place = db.get(TripPlace, trip_place_id)
    if trip_place is None or trip_place.trip_id != trip_id:
        raise HTTPException(status_code=404, detail="Trip place not found")
    return trip_place


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
    update_schedule(db, trip_id)
    db.commit()
    db.refresh(trip_place)
    return trip_place


@router.get("", response_model=TripPlaceList)
def list_trip_places(trip_id: UUID, db: Session = Depends(get_db)):
    trip = db.get(Trip, trip_id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip_places = db.scalars(
        select(TripPlace)
        .where(TripPlace.trip_id == trip_id)
        .options(selectinload(TripPlace.place))
        .order_by(TripPlace.visit_order)
    ).all()
    return {"items": trip_places, "warnings": check_constraints(trip, trip_places)}


@router.put("/order", response_model=list[TripPlaceRead])
def reorder_trip_places(
    trip_id: UUID, payload: TripPlaceOrder, db: Session = Depends(get_db)
):
    if db.get(Trip, trip_id) is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip_places = db.scalars(
        select(TripPlace).where(TripPlace.trip_id == trip_id)
    ).all()
    by_id = {tp.id: tp for tp in trip_places}
    ids = payload.trip_place_ids
    if len(ids) != len(set(ids)) or set(ids) != set(by_id):
        raise HTTPException(
            status_code=422,
            detail="trip_place_ids must list every trip place of the trip exactly once",
        )

    for order, trip_place_id in enumerate(ids, start=1):
        by_id[trip_place_id].visit_order = order
    update_schedule(db, trip_id)
    db.commit()
    return sorted(trip_places, key=lambda tp: tp.visit_order)


@router.patch("/{trip_place_id}", response_model=TripPlaceRead)
def update_trip_place(
    trip_id: UUID,
    trip_place_id: UUID,
    payload: TripPlaceUpdate,
    db: Session = Depends(get_db),
):
    trip_place = get_trip_place_or_404(db, trip_id, trip_place_id)
    trip_place.stay_minutes = payload.stay_minutes
    update_schedule(db, trip_id)
    db.commit()
    db.refresh(trip_place)
    return trip_place


@router.delete("/{trip_place_id}", status_code=204)
def remove_trip_place(
    trip_id: UUID, trip_place_id: UUID, db: Session = Depends(get_db)
):
    trip_place = get_trip_place_or_404(db, trip_id, trip_place_id)
    removed_order = trip_place.visit_order
    db.delete(trip_place)
    db.execute(
        update(TripPlace)
        .where(TripPlace.trip_id == trip_id, TripPlace.visit_order > removed_order)
        .values(visit_order=TripPlace.visit_order - 1)
    )
    update_schedule(db, trip_id)
    db.commit()

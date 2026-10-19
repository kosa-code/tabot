from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.deps import get_db
from app.models import Place
from app.schemas import PlaceCreate, PlaceRead, PlaceUpdate

router = APIRouter(prefix="/places", tags=["places"])


@router.post("", response_model=PlaceRead)
def create_place(payload: PlaceCreate, db: Session = Depends(get_db)):
    place = Place(**payload.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


@router.get("", response_model=list[PlaceRead])
def list_places(db: Session = Depends(get_db)):
    return db.scalars(select(Place).order_by(Place.name)).all()


@router.get("/{place_id}", response_model=PlaceRead)
def get_place(place_id: UUID, db: Session = Depends(get_db)):
    place = db.get(Place, place_id)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


@router.patch("/{place_id}", response_model=PlaceRead)
def update_place(place_id: UUID, payload: PlaceUpdate, db: Session = Depends(get_db)):
    place = db.get(Place, place_id)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(place, field, value)
    if "opening_hours" in payload.model_fields_set:
        place.fetched_at = func.now()
    db.commit()
    db.refresh(place)
    return place

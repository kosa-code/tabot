from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import Trip, User
from app.schemas import TripCreate, TripRead, TripUpdate

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/trips", response_model=TripRead)
def create_trip(payload: TripCreate, db: Session = Depends(get_db)):
    user = db.scalars(select(User)).first()  # 暫定: 最初のユーザー
    trip = Trip(
        user_id=user.id,
        name=payload.name,
        start_at=payload.start_at,
        end_at=payload.end_at,
        budget=payload.budget,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@app.get("/trips", response_model=list[TripRead])
def list_trips(db: Session = Depends(get_db)):
    return db.scalars(select(Trip).order_by(Trip.start_at)).all()


@app.get("/trips/{trip_id}", response_model=TripRead)
def get_trip(trip_id: UUID, db: Session = Depends(get_db)):
    trip = db.get(Trip, trip_id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@app.patch("/trips/{trip_id}", response_model=TripRead)
def update_trip(trip_id: UUID, payload: TripUpdate, db: Session = Depends(get_db)):
    trip = db.get(Trip, trip_id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)
    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/trips/{trip_id}", status_code=204)
def delete_trip(trip_id: UUID, db: Session = Depends(get_db)):
    trip = db.get(Trip, trip_id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()

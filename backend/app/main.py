from fastapi import FastAPI

from app.routers import places, trip_places, trips

app = FastAPI()
app.include_router(trips.router)
app.include_router(places.router)
app.include_router(trip_places.router)


@app.get("/health")
def health():
    return {"status": "ok"}

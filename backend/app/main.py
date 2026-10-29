from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import places, trip_places, trips

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(trips.router)
app.include_router(places.router)
app.include_router(trip_places.router)


@app.get("/health")
def health():
    return {"status": "ok"}

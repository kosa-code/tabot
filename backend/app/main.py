from fastapi import FastAPI

from app.routers import places, trips

app = FastAPI()
app.include_router(trips.router)
app.include_router(places.router)


@app.get("/health")
def health():
    return {"status": "ok"}

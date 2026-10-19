from fastapi import FastAPI

from app.routers import trips

app = FastAPI()
app.include_router(trips.router)


@app.get("/health")
def health():
    return {"status": "ok"}

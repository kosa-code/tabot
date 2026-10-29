from types import SimpleNamespace

from app.services.schedule import travel_minutes

NAGOYA_STATION = SimpleNamespace(latitude=35.1709, longitude=136.8815)
NAGOYA_CASTLE = SimpleNamespace(latitude=35.1856, longitude=136.8991)


def test_travel_minutes_nagoya_to_castle():
    assert travel_minutes(NAGOYA_STATION, NAGOYA_CASTLE) == 38

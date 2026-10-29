START = "2026-11-01T10:00:00+09:00"
END = "2026-11-01T18:00:00+09:00"


def create_trip(client, start=START, end=END):
    r = client.post("/trips", json={"name": "test", "start_at": start, "end_at": end})
    assert r.status_code == 200
    return r.json()


def create_place(client, name, lat, lon):
    r = client.post("/places", json={"name": name, "latitude": lat, "longitude": lon})
    assert r.status_code == 200
    return r.json()


def add(client, trip_id, place_id, stay=0):
    r = client.post(
        f"/trips/{trip_id}/places", json={"place_id": place_id, "stay_minutes": stay}
    )
    assert r.status_code == 200
    return r.json()


def items(client, trip_id):
    return client.get(f"/trips/{trip_id}/places").json()["items"]


def test_trip_end_must_be_after_start(client):
    r = client.post("/trips", json={"name": "x", "start_at": END, "end_at": START})
    assert r.status_code == 422


def test_add_trip_place_appends_to_end(client):
    trip = create_trip(client)
    place = create_place(client, "A", 35.0, 136.0)
    orders = [add(client, trip["id"], place["id"])["visit_order"] for _ in range(3)]
    assert orders == [1, 2, 3]


def test_remove_trip_place_closes_gap(client):
    trip = create_trip(client)
    place = create_place(client, "A", 35.0, 136.0)
    tps = [add(client, trip["id"], place["id"]) for _ in range(3)]

    r = client.delete(f"/trips/{trip['id']}/places/{tps[1]['id']}")
    assert r.status_code == 204

    rows = items(client, trip["id"])
    assert [row["id"] for row in rows] == [tps[0]["id"], tps[2]["id"]]
    assert [row["visit_order"] for row in rows] == [1, 2]


def test_reorder_requires_all_ids(client):
    trip = create_trip(client)
    place = create_place(client, "A", 35.0, 136.0)
    tps = [add(client, trip["id"], place["id"]) for _ in range(2)]

    r = client.put(
        f"/trips/{trip['id']}/places/order", json={"trip_place_ids": [tps[0]["id"]]}
    )
    assert r.status_code == 422


def test_reorder_changes_order(client):
    trip = create_trip(client)
    place = create_place(client, "A", 35.0, 136.0)
    a, b = add(client, trip["id"], place["id"]), add(client, trip["id"], place["id"])

    r = client.put(
        f"/trips/{trip['id']}/places/order", json={"trip_place_ids": [b["id"], a["id"]]}
    )
    assert r.status_code == 200
    assert [row["id"] for row in items(client, trip["id"])] == [b["id"], a["id"]]


def test_schedule_fills_times(client):
    trip = create_trip(client)
    station = create_place(client, "駅", 35.1709, 136.8815)
    castle = create_place(client, "城", 35.1856, 136.8991)
    add(client, trip["id"], station["id"], stay=30)
    add(client, trip["id"], castle["id"], stay=90)

    first, second = items(client, trip["id"])
    assert first["start_time"] == "2026-11-01T10:00:00+09:00"
    assert first["end_time"] == "2026-11-01T10:30:00+09:00"
    assert second["travel_minutes"] == 38
    assert second["start_time"] == "2026-11-01T11:08:00+09:00"
    assert second["end_time"] == "2026-11-01T12:38:00+09:00"


def test_warning_when_exceeding_trip_end(client):
    trip = create_trip(client, end="2026-11-01T11:00:00+09:00")
    place = create_place(client, "A", 35.0, 136.0)
    tp = add(client, trip["id"], place["id"], stay=30)

    r = client.get(f"/trips/{trip['id']}/places").json()
    assert r["warnings"] == []

    client.patch(f"/trips/{trip['id']}/places/{tp['id']}", json={"stay_minutes": 90})
    r = client.get(f"/trips/{trip['id']}/places").json()
    assert [w["code"] for w in r["warnings"]] == ["exceeds_trip_end"]

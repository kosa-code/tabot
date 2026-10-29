const API_URL = 'http://127.0.0.1:8000'

export type Trip = {
  id: string
  user_id: string
  name: string
  start_at: string
  end_at: string
  budget: number | null
}

export type TripPlace = {
  id: string
  trip_id: string
  place_id: string
  place_name: string
  visit_order: number
  stay_minutes: number
  travel_minutes: number | null
  start_time: string | null
  end_time: string | null
}

export type ScheduleWarning = {
  code: string
  message: string
}

export type TripPlaceList = {
  items: TripPlace[]
  warnings: ScheduleWarning[]
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export const fetchTrips = () => getJson<Trip[]>('/trips')
export const fetchTrip = (tripId: string) => getJson<Trip>(`/trips/${tripId}`)
export const fetchTripPlaces = (tripId: string) =>
  getJson<TripPlaceList>(`/trips/${tripId}/places`)

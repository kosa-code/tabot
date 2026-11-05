import type {
  Place,
  Trip,
  TripCreate,
  TripPlace,
  TripPlaceCreate,
  TripPlaceList,
} from './types/schemas'

const API_URL = 'http://127.0.0.1:8000'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

async function send<T>(method: string, path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`${method} ${path} failed: ${res.status} ${detail}`)
  }
  return res.json()
}

async function remove(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { method: 'DELETE' })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`DELETE ${path} failed: ${res.status} ${detail}`)
  }
}

export const fetchTrips = () => getJson<Trip[]>('/trips')
export const fetchTrip = (tripId: string) => getJson<Trip>(`/trips/${tripId}`)
export const fetchTripPlaces = (tripId: string) =>
  getJson<TripPlaceList>(`/trips/${tripId}/places`)
export const createTrip = (payload: TripCreate) =>
  send<Trip>('POST', '/trips', payload)
export const fetchPlaces = () => getJson<Place[]>('/places')
export const addTripPlace = (tripId: string, payload: TripPlaceCreate) =>
  send<TripPlace>('POST', `/trips/${tripId}/places`, payload)
export const deleteTripPlace = (tripId: string, tripPlaceId: string) =>
  remove(`/trips/${tripId}/places/${tripPlaceId}`)

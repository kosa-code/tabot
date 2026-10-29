import type { Trip, TripPlaceList } from './types/schemas'

const API_URL = 'http://127.0.0.1:8000'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export const fetchTrips = () => getJson<Trip[]>('/trips')
export const fetchTrip = (tripId: string) => getJson<Trip>(`/trips/${tripId}`)
export const fetchTripPlaces = (tripId: string) =>
  getJson<TripPlaceList>(`/trips/${tripId}/places`)

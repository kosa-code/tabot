import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchTrips } from '../api'
import type { Trip } from '../types/schemas'

function TripList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch((e: Error) => setError(e.message))
  }, [])

  if (error) return <p>エラー: {error}</p>

  return (
    <main>
      <h1>旅行一覧</h1>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
            （{new Date(trip.start_at).toLocaleString('ja-JP')}〜）
          </li>
        ))}
      </ul>
    </main>
  )
}

export default TripList

import { useEffect, useState } from 'react'
import { fetchTrips } from '../api'
import Alert from '../components/Alert'
import PageLayout from '../components/PageLayout'
import TripListItem from '../components/TripListItem'
import type { Trip } from '../types/schemas'

function TripList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <PageLayout title="旅行一覧">
      {error && <Alert>エラー: {error}</Alert>}
      <ul className="space-y-3">
        {trips.map((trip) => (
          <li key={trip.id}>
            <TripListItem trip={trip} />
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}

export default TripList

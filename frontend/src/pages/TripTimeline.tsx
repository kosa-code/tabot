import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { addTripPlace, fetchPlaces, fetchTrip, fetchTripPlaces } from '../api'
import AddTripPlaceForm from '../components/AddTripPlaceForm'
import Alert from '../components/Alert'
import Card from '../components/Card'
import Message from '../components/Message'
import PageLayout from '../components/PageLayout'
import TimelineItem from '../components/TimelineItem'
import TravelSegment from '../components/TravelSegment'
import type {
  Place,
  Trip,
  TripPlaceCreate,
  TripPlaceList,
} from '../types/schemas'
import { formatPeriod } from '../utils/format'

const BACK = { to: '/', label: '旅行一覧' }

function TripTimeline() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [plan, setPlan] = useState<TripPlaceList | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return
    Promise.all([fetchTrip(tripId), fetchTripPlaces(tripId), fetchPlaces()])
      .then(([t, p, pl]) => {
        setTrip(t)
        setPlan(p)
        setPlaces(pl)
      })
      .catch((e: Error) => setError(e.message))
  }, [tripId])

  async function handleAdd(payload: TripPlaceCreate) {
    if (!tripId) return
    await addTripPlace(tripId, payload)
    setPlan(await fetchTripPlaces(tripId))
  }

  if (error) {
    return (
      <PageLayout title="タイムライン" back={BACK}>
        <Alert>エラー: {error}</Alert>
      </PageLayout>
    )
  }

  if (!trip || !plan) {
    return (
      <PageLayout title="タイムライン" back={BACK}>
        <Message>読み込み中…</Message>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={trip.name}
      back={BACK}
      description={formatPeriod(trip.start_at, trip.end_at)}
    >
      {plan.warnings.map((w) => (
        <Alert key={w.code}>{w.message}</Alert>
      ))}

      {plan.items.length === 0 && <Message>まだ旅程がありません</Message>}
      <ol>
        {plan.items.map((item) => (
          <li key={item.id}>
            {item.travel_minutes !== null && (
              <TravelSegment minutes={item.travel_minutes} />
            )}
            <TimelineItem item={item} />
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <Card>
          <AddTripPlaceForm places={places} onAdd={handleAdd} />
        </Card>
      </div>
    </PageLayout>
  )
}

export default TripTimeline

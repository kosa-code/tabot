import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { fetchTrip, fetchTripPlaces } from '../api'
import Alert from '../components/Alert'
import Message from '../components/Message'
import PageLayout from '../components/PageLayout'
import TimelineItem from '../components/TimelineItem'
import TravelSegment from '../components/TravelSegment'
import type { Trip, TripPlaceList } from '../types/schemas'
import { formatPeriod } from '../utils/format'

const BACK = { to: '/', label: '旅行一覧' }

function TripTimeline() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [plan, setPlan] = useState<TripPlaceList | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return
    Promise.all([fetchTrip(tripId), fetchTripPlaces(tripId)])
      .then(([t, p]) => {
        setTrip(t)
        setPlan(p)
      })
      .catch((e: Error) => setError(e.message))
  }, [tripId])

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
    </PageLayout>
  )
}

export default TripTimeline

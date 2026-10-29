import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  fetchTrip,
  fetchTripPlaces,
  type Trip,
  type TripPlaceList,
} from '../api'

function formatTime(iso: string | null) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

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

  if (error) return <p>エラー: {error}</p>
  if (!trip || !plan) return <p>読み込み中…</p>

  return (
    <main>
      <Link to="/">← 旅行一覧</Link>
      <h1>{trip.name}</h1>

      {plan.warnings.map((w) => (
        <p key={w.code} role="alert">
          ⚠ {w.message}
        </p>
      ))}

      {plan.items.length === 0 && <p>まだ旅程がありません</p>}
      <ol>
        {plan.items.map((item) => (
          <li key={item.id}>
            {item.travel_minutes !== null && (
              <div>↓ 徒歩{item.travel_minutes}分</div>
            )}
            <div>
              {formatTime(item.start_time)}〜{formatTime(item.end_time)}{' '}
              {item.place_name}（滞在{item.stay_minutes}分）
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default TripTimeline

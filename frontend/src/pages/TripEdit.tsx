import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchTrip, updateTrip } from '../api'
import Alert from '../components/Alert'
import Card from '../components/Card'
import Message from '../components/Message'
import PageLayout from '../components/PageLayout'
import TripForm from '../components/TripForm'
import type { Trip, TripCreate } from '../types/schemas'

function TripEdit() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return
    fetchTrip(tripId)
      .then(setTrip)
      .catch((e: Error) => setError(e.message))
  }, [tripId])

  async function handleSubmit(payload: TripCreate) {
    if (!tripId) return
    await updateTrip(tripId, payload)
    navigate(`/trips/${tripId}`)
  }

  const back = { to: `/trips/${tripId}`, label: 'タイムライン' }

  return (
    <PageLayout title="旅行を編集" back={back}>
      {error && <Alert>エラー: {error}</Alert>}
      {!error && !trip && <Message>読み込み中…</Message>}
      {trip && (
        <Card>
          <TripForm submitLabel="保存する" initial={trip} onSubmit={handleSubmit} />
        </Card>
      )}
    </PageLayout>
  )
}

export default TripEdit

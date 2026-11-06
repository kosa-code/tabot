import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { deleteTrip, fetchTrip, updateTrip } from '../api'
import Alert from '../components/Alert'
import Button from '../components/Button'
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

  async function handleDelete() {
    if (!tripId || !trip) return
    if (!confirm(`「${trip.name}」を削除しますか？旅程もすべて消えます。`)) return
    try {
      await deleteTrip(tripId)
      navigate('/')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const back = { to: `/trips/${tripId}`, label: 'タイムライン' }

  return (
    <PageLayout title="旅行を編集" back={back}>
      {error && <Alert>エラー: {error}</Alert>}
      {!error && !trip && <Message>読み込み中…</Message>}
      {trip && (
        <>
          <Card>
            <TripForm submitLabel="保存する" initial={trip} onSubmit={handleSubmit} />
          </Card>
          <div className="mt-6">
            <Button variant="secondary" onClick={handleDelete}>
              この旅行を削除
            </Button>
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default TripEdit

import { useNavigate } from 'react-router'
import { createTrip } from '../api'
import Card from '../components/Card'
import PageLayout from '../components/PageLayout'
import TripForm from '../components/TripForm'
import type { TripCreate } from '../types/schemas'

function TripNew() {
  const navigate = useNavigate()

  async function handleSubmit(payload: TripCreate) {
    const trip = await createTrip(payload)
    navigate(`/trips/${trip.id}`)
  }

  return (
    <PageLayout title="旅行を作成" back={{ to: '/', label: '旅行一覧' }}>
      <Card>
        <TripForm submitLabel="作成する" onSubmit={handleSubmit} />
      </Card>
    </PageLayout>
  )
}

export default TripNew

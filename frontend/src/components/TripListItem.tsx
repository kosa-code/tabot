import { Link } from 'react-router'
import type { Trip } from '../types/schemas'
import { formatPeriod } from '../utils/format'
import Card from './Card'

type Props = {
  trip: Trip
}

function TripListItem({ trip }: Props) {
  return (
    <Card>
      <Link
        to={`/trips/${trip.id}`}
        className="font-semibold text-blue-600 hover:underline"
      >
        {trip.name}
      </Link>
      <p className="mt-1 text-sm text-gray-500">
        {formatPeriod(trip.start_at, trip.end_at)}
      </p>
    </Card>
  )
}

export default TripListItem

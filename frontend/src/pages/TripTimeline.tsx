import { Link, useParams } from 'react-router'

function TripTimeline() {
  const { tripId } = useParams()

  return (
    <main>
      <Link to="/">← 旅行一覧</Link>
      <h1>タイムライン</h1>
      <p>旅行ID: {tripId}</p>
    </main>
  )
}

export default TripTimeline

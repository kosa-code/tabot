import { Route, Routes } from 'react-router'
import TripList from './pages/TripList'
import TripNew from './pages/TripNew'
import TripTimeline from './pages/TripTimeline'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TripList />} />
      <Route path="/trips/new" element={<TripNew />} />
      <Route path="/trips/:tripId" element={<TripTimeline />} />
    </Routes>
  )
}

export default App

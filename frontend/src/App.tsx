import { Route, Routes } from 'react-router'
import TripList from './pages/TripList'
import TripEdit from './pages/TripEdit'
import TripNew from './pages/TripNew'
import TripTimeline from './pages/TripTimeline'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TripList />} />
      <Route path="/trips/new" element={<TripNew />} />
      <Route path="/trips/:tripId" element={<TripTimeline />} />
      <Route path="/trips/:tripId/edit" element={<TripEdit />} />
    </Routes>
  )
}

export default App

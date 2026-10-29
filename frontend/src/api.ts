const API_URL = 'http://127.0.0.1:8000'

export type Trip = {
  id: string
  user_id: string
  name: string
  start_at: string
  end_at: string
  budget: number | null
}

export async function fetchTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`)
  if (!res.ok) throw new Error(`GET /trips failed: ${res.status}`)
  return res.json()
}

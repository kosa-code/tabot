// backend/app/models.py の4テーブルに対応する型

export type OpeningHours = Record<string, [string, string] | null>

export type User = {
  id: string
  name: string
  email: string
  created_at: string
}

export type Trip = {
  id: string
  user_id: string
  name: string
  start_at: string
  end_at: string
  budget: number | null
}

export type Place = {
  id: string
  name: string
  latitude: number
  longitude: number
  category: string | null
  opening_hours: OpeningHours | null
  fetched_at: string
}

export type TripPlace = {
  id: string
  trip_id: string
  place_id: string
  visit_order: number
  stay_minutes: number
  start_time: string | null
  end_time: string | null
}

// Phase 3 の案。DBにはまだ無く、モック表示のためにサンプルJSONだけが持つ
export type Expense = {
  id: string
  trip_id: string
  payer_id: string
  amount: number
  description: string
}

export type SampleData = {
  users: User[]
  trips: Trip[]
  places: Place[]
  trip_places: TripPlace[]
  expenses: Expense[]
}

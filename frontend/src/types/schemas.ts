// backend/app/schemas.py と対応させる

// TripRead
export type Trip = {
  id: string
  user_id: string
  name: string
  start_at: string
  end_at: string
  budget: number | null
}

// TripPlaceRead
export type TripPlace = {
  id: string
  trip_id: string
  place_id: string
  place_name: string
  visit_order: number
  stay_minutes: number
  travel_minutes: number | null
  start_time: string | null
  end_time: string | null
}

// ScheduleWarning
export type ScheduleWarning = {
  code: string
  message: string
}

// TripPlaceList
export type TripPlaceList = {
  items: TripPlace[]
  warnings: ScheduleWarning[]
}

// TripCreate
export type TripCreate = {
  name: string
  start_at: string
  end_at: string
  budget: number | null
}

// PlaceRead
export type Place = {
  id: string
  name: string
  latitude: number
  longitude: number
  category: string | null
  opening_hours: Record<string, unknown> | null
  fetched_at: string
}

// TripPlaceCreate
export type TripPlaceCreate = {
  place_id: string
  stay_minutes: number
}

// TripPlaceUpdate
export type TripPlaceUpdate = {
  stay_minutes: number
}

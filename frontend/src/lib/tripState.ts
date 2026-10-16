// 旅程の state と、その不変条件(tripPlaces は visit_order 昇順、index + 1 === visit_order)を
// reducer に閉じ込める。順序を変えるのはここだけ。

import { normalize, reorder } from '@/lib/schedule'
import type { Place, Trip, TripPlace } from '@/types'

export type TripState = {
  trip: Trip
  places: Place[]
  tripPlaces: TripPlace[]
}

export type NewPlace = Omit<Place, 'id' | 'fetched_at'>

export type TripAction =
  | { type: 'editTrip'; trip: Trip }
  | { type: 'setBudget'; budget: number | null }
  | { type: 'addExisting'; placeId: string; stayMinutes: number }
  | { type: 'addNew'; place: NewPlace; stayMinutes: number }
  | { type: 'move'; tripPlaceId: string; direction: -1 | 1 }
  | { type: 'remove'; tripPlaceId: string }
  | { type: 'setStay'; tripPlaceId: string; stayMinutes: number }

export function initTripState(trip: Trip, places: Place[], tripPlaces: TripPlace[]): TripState {
  return { trip, places, tripPlaces: normalize(tripPlaces.filter((tp) => tp.trip_id === trip.id)) }
}

function append(state: TripState, placeId: string, stayMinutes: number): TripPlace[] {
  return reorder([
    ...state.tripPlaces,
    {
      id: crypto.randomUUID(),
      trip_id: state.trip.id,
      place_id: placeId,
      visit_order: state.tripPlaces.length + 1,
      stay_minutes: stayMinutes,
      start_time: null,
      end_time: null,
    },
  ])
}

export function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'editTrip':
      return { ...state, trip: action.trip }
    case 'setBudget':
      return { ...state, trip: { ...state.trip, budget: action.budget } }
    case 'addExisting':
      return { ...state, tripPlaces: append(state, action.placeId, action.stayMinutes) }
    case 'addNew': {
      const place: Place = { ...action.place, id: crypto.randomUUID(), fetched_at: new Date().toISOString() }
      return { ...state, places: [...state.places, place], tripPlaces: append(state, place.id, action.stayMinutes) }
    }
    case 'move': {
      const list = [...state.tripPlaces]
      const index = list.findIndex((tp) => tp.id === action.tripPlaceId)
      const target = index + action.direction
      if (index < 0 || target < 0 || target >= list.length) return state
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...state, tripPlaces: reorder(list) }
    }
    case 'remove':
      return { ...state, tripPlaces: reorder(state.tripPlaces.filter((tp) => tp.id !== action.tripPlaceId)) }
    case 'setStay':
      return {
        ...state,
        tripPlaces: state.tripPlaces.map((tp) => (tp.id === action.tripPlaceId ? { ...tp, stay_minutes: Math.max(0, action.stayMinutes) } : tp)),
      }
  }
}

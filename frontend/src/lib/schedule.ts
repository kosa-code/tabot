// タイムラインの計算。本来は backend の update_schedule が担当する処理で、
// モック表示のために同じ割り切り(訪問順は変えない、前から順に足す)をフロントに置いている。

import { formatTime, weekdayKey } from '@/lib/format'
import type { Place, Trip, TripPlace } from '@/types'

export type TimelineItem = {
  tripPlace: TripPlace
  place: Place
  travelMinutes: number
  arrive: Date
  depart: Date
  warnings: string[]
}

const EARTH_RADIUS_KM = 6371

export function distanceKm(a: Place, b: Place): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** 直線距離×係数の仮実装。3km未満は徒歩、それ以上は鉄道相当とみなす */
export function travelMinutes(a: Place, b: Place): number {
  const km = distanceKm(a, b)
  const minutes = km < 3 ? (km / 4.5) * 60 * 1.3 : (km / 80) * 60 * 1.2 + 15
  return Math.max(0, Math.round(minutes / 5) * 5)
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

function checkOpeningHours(place: Place, arrive: Date, depart: Date): string[] {
  if (!place.opening_hours) return []
  const hours = place.opening_hours[weekdayKey(arrive)]
  if (hours === undefined) return []
  if (hours === null) return ['この曜日は休業日です']
  const [open, close] = hours
  const arriveAt = formatTime(arrive)
  const departAt = formatTime(depart)
  const warnings: string[] = []
  if (arriveAt < open) warnings.push(`開店前に到着します(開店 ${open})`)
  if (arriveAt >= close) warnings.push(`閉店後に到着します(閉店 ${close})`)
  else if (departAt > close) warnings.push(`滞在中に閉店します(閉店 ${close})`)
  return warnings
}

export function buildTimeline(
  trip: Trip,
  tripPlaces: TripPlace[],
  places: Place[],
): TimelineItem[] {
  const placeById = new Map(places.map((p) => [p.id, p]))
  const sorted = [...tripPlaces].sort((a, b) => a.visit_order - b.visit_order)
  const tripEnd = new Date(trip.end_at)

  let cursor = new Date(trip.start_at)
  let prev: Place | null = null
  const items: TimelineItem[] = []

  for (const tp of sorted) {
    const place = placeById.get(tp.place_id)
    if (!place) continue
    const travel = prev ? travelMinutes(prev, place) : 0
    const arrive = addMinutes(cursor, travel)
    const depart = addMinutes(arrive, tp.stay_minutes)
    const warnings = checkOpeningHours(place, arrive, depart)
    if (depart > tripEnd) warnings.push('旅行の終了時刻を超えています')
    items.push({ tripPlace: tp, place, travelMinutes: travel, arrive, depart, warnings })
    cursor = depart
    prev = place
  }
  return items
}

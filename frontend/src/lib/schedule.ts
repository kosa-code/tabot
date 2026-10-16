// タイムラインの計算。本来は backend の update_schedule が担当する処理で、
// モック表示のために同じ割り切り(訪問順は変えない、前から順に足す)をフロントに置いている。
//
// 不変条件: tripPlaces は常に visit_order 昇順で、配列の index + 1 === visit_order。
// 並び替え・追加・削除のあとは必ず reorder() を通す。buildTimeline は配列順を信頼する。

import { formatTime, weekdayKey } from '@/lib/format'
import type { Place, Trip, TripPlace } from '@/types'

export type WarningKind = 'closed' | 'before-open' | 'after-close' | 'closes-during' | 'past-trip-end'

export type Warning = {
  kind: WarningKind
  /** 開店・閉店の時刻("HH:MM")。kind によっては無い */
  at?: string
}

export type TravelMode = 'walk' | 'transit'

export type TimelineItem = {
  tripPlace: TripPlace
  place: Place
  travelMinutes: number
  /** 直前の地点からの移動手段(仮実装では距離で決める) */
  travelMode: TravelMode
  arrive: Date
  depart: Date
  warnings: Warning[]
}

/** 配列順を訪問順として visit_order を振り直す */
export function reorder(list: TripPlace[]): TripPlace[] {
  return list.map((tp, i) => (tp.visit_order === i + 1 ? tp : { ...tp, visit_order: i + 1 }))
}

/** 初期データなど、順序が保証されていない配列を不変条件に合わせる */
export function normalize(list: TripPlace[]): TripPlace[] {
  return reorder([...list].sort((a, b) => a.visit_order - b.visit_order))
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

/** 3km 未満は徒歩、それ以上は鉄道相当とみなす(仮実装の境界) */
export const WALK_LIMIT_KM = 3

export function travelMode(a: Place, b: Place): TravelMode {
  return distanceKm(a, b) < WALK_LIMIT_KM ? 'walk' : 'transit'
}

/** 直線距離×係数の仮実装 */
export function travelMinutes(a: Place, b: Place): number {
  const km = distanceKm(a, b)
  const minutes = travelMode(a, b) === 'walk' ? (km / 4.5) * 60 * 1.3 : (km / 80) * 60 * 1.2 + 15
  return Math.max(0, Math.round(minutes / 5) * 5)
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

// 営業時間の判定は到着日の曜日で行う。日をまたぐ滞在は考慮しない(モックの割り切り)
function checkOpeningHours(place: Place, arrive: Date, depart: Date): Warning[] {
  if (!place.opening_hours) return []
  const hours = place.opening_hours[weekdayKey(arrive)]
  if (hours === undefined) return []
  if (hours === null) return [{ kind: 'closed' }]
  const [open, close] = hours
  const arriveAt = formatTime(arrive)
  const departAt = formatTime(depart)
  const warnings: Warning[] = []
  if (arriveAt < open) warnings.push({ kind: 'before-open', at: open })
  if (arriveAt >= close) warnings.push({ kind: 'after-close', at: close })
  else if (departAt > close) warnings.push({ kind: 'closes-during', at: close })
  return warnings
}

export function buildTimeline(trip: Trip, tripPlaces: TripPlace[], places: Place[]): TimelineItem[] {
  const placeById = new Map(places.map((p) => [p.id, p]))
  const tripEnd = new Date(trip.end_at)

  let cursor = new Date(trip.start_at)
  let prev: Place | null = null
  const items: TimelineItem[] = []

  for (const tp of tripPlaces) {
    const place = placeById.get(tp.place_id)
    if (!place) continue
    const travel = prev ? travelMinutes(prev, place) : 0
    const mode = prev ? travelMode(prev, place) : 'walk'
    const arrive = addMinutes(cursor, travel)
    const depart = addMinutes(arrive, tp.stay_minutes)
    const warnings = checkOpeningHours(place, arrive, depart)
    if (depart > tripEnd) warnings.push({ kind: 'past-trip-end' })
    items.push({ tripPlace: tp, place, travelMinutes: travel, travelMode: mode, arrive, depart, warnings })
    cursor = depart
    prev = place
  }
  return items
}

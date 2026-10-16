import { useMemo, useState } from 'react'

import { AddPlaceForm, type AddPlaceInput } from '@/components/trip/AddPlaceForm'
import { Timeline } from '@/components/trip/Timeline'
import { TripCard } from '@/components/trip/TripCard'
import { TripSummary } from '@/components/trip/TripSummary'
import { Badge } from '@/components/ui/Badge'
import { sampleData } from '@/data/sample'
import { buildTimeline } from '@/lib/schedule'
import type { Place, Trip, TripPlace } from '@/types'

// モック: バックエンド未接続のため、サンプルデータをメモリ上で編集する
export default function App() {
  const [trip, setTrip] = useState<Trip>(sampleData.trips[0])
  const [places, setPlaces] = useState<Place[]>(sampleData.places)
  const [tripPlaces, setTripPlaces] = useState<TripPlace[]>(
    sampleData.trip_places.filter((tp) => tp.trip_id === sampleData.trips[0].id),
  )

  const items = useMemo(() => buildTimeline(trip, tripPlaces, places), [trip, tripPlaces, places])

  function renumber(list: TripPlace[]): TripPlace[] {
    return list.map((tp, i) => ({ ...tp, visit_order: i + 1 }))
  }

  function handleAdd(input: AddPlaceInput) {
    let placeId: string
    if ('existingPlaceId' in input) {
      placeId = input.existingPlaceId
    } else {
      const place: Place = { ...input.place, id: crypto.randomUUID(), fetched_at: new Date().toISOString() }
      setPlaces((prev) => [...prev, place])
      placeId = place.id
    }
    setTripPlaces((prev) =>
      renumber([
        ...prev,
        {
          id: crypto.randomUUID(),
          trip_id: trip.id,
          place_id: placeId,
          visit_order: prev.length + 1,
          stay_minutes: input.stayMinutes,
          start_time: null,
          end_time: null,
        },
      ]),
    )
  }

  function handleMove(tripPlaceId: string, direction: -1 | 1) {
    setTripPlaces((prev) => {
      const sorted = [...prev].sort((a, b) => a.visit_order - b.visit_order)
      const index = sorted.findIndex((tp) => tp.id === tripPlaceId)
      const target = index + direction
      if (index < 0 || target < 0 || target >= sorted.length) return prev
      ;[sorted[index], sorted[target]] = [sorted[target], sorted[index]]
      return renumber(sorted)
    })
  }

  function handleRemove(tripPlaceId: string) {
    setTripPlaces((prev) => renumber(prev.filter((tp) => tp.id !== tripPlaceId).sort((a, b) => a.visit_order - b.visit_order)))
  }

  function handleStayChange(tripPlaceId: string, stayMinutes: number) {
    setTripPlaces((prev) => prev.map((tp) => (tp.id === tripPlaceId ? { ...tp, stay_minutes: Math.max(0, stayMinutes) } : tp)))
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-semibold tracking-tight">tabot</span>
            <span className="text-[12px] text-neutral-500">旅行プランナー</span>
          </div>
          <Badge tone="accent">モック · サンプルデータ</Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <TripCard trip={trip} onChange={setTrip} />
          <AddPlaceForm existingPlaces={places} onAdd={handleAdd} />
        </div>
        <div className="space-y-4">
          <TripSummary items={items} />
          <Timeline items={items} onMove={handleMove} onRemove={handleRemove} onStayChange={handleStayChange} />
        </div>
      </main>
    </div>
  )
}

import { useMemo, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { AddPlaceForm, type AddPlaceInput } from '@/components/trip/AddPlaceForm'
import { BudgetCard } from '@/components/trip/BudgetCard'
import { ItineraryCard } from '@/components/trip/ItineraryCard'
import { Timeline } from '@/components/trip/Timeline'
import { TripEditForm } from '@/components/trip/TripEditForm'
import { WarningsCard } from '@/components/trip/WarningsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Icon } from '@/components/ui/Icon'
import { ShellCard } from '@/components/ui/ShellCard'
import { sampleData } from '@/data/sample'
import { DISPLAY_TIME_ZONE, formatDate, formatTime } from '@/lib/format'
import { buildTimeline } from '@/lib/schedule'
import type { Place, Trip, TripPlace } from '@/types'

type DialogKind = 'none' | 'editTrip' | 'addPlace'

// モック: バックエンド未接続のため、サンプルデータをメモリ上で編集する
export default function App() {
  const firstTrip = sampleData.trips[0]
  const [trip, setTrip] = useState<Trip>(firstTrip)
  const [places, setPlaces] = useState<Place[]>(sampleData.places)
  const [tripPlaces, setTripPlaces] = useState<TripPlace[]>(sampleData.trip_places.filter((tp) => tp.trip_id === firstTrip.id))
  const [dialog, setDialog] = useState<DialogKind>('none')
  const expenses = sampleData.expenses.filter((e) => e.trip_id === firstTrip.id)

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
    setDialog('none')
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

  const start = new Date(trip.start_at)
  const end = new Date(trip.end_at)

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar crumbs={['旅程', trip.name]} />

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold tracking-[-0.01em]">{trip.name}</h1>
                <Badge tone="pink" icon="flag" size="md">
                  モック
                </Badge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Icon name="calendar" size={14} />
                  {formatDate(start)} {formatTime(start)} 〜 {formatDate(end)} {formatTime(end)}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="clock" size={14} />
                  {DISPLAY_TIME_ZONE}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setDialog('editTrip')}>
                <Icon name="pencil" size={15} />
                旅行を編集
              </Button>
              <Button variant="primary" onClick={() => setDialog('addPlace')}>
                <Icon name="plus" size={15} />
                場所を追加
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <BudgetCard budget={trip.budget} expenses={expenses} onBudgetChange={(budget) => setTrip((t) => ({ ...t, budget }))} />
            <ItineraryCard items={items} />
            <WarningsCard items={items} />
          </div>

          <ShellCard
            icon="route"
            title="タイムライン"
            subtitle="訪問順に到着・出発時刻を計算"
            bodyClassName="p-2 sm:p-3"
            action={
              <Button variant="primary" size="sm" onClick={() => setDialog('addPlace')}>
                <Icon name="plus" size={14} />
                場所を追加
              </Button>
            }
          >
            <Timeline items={items} onMove={handleMove} onRemove={handleRemove} onStayChange={handleStayChange} />
          </ShellCard>
        </main>
      </div>

      <Dialog open={dialog === 'editTrip'} title="旅行を編集" onClose={() => setDialog('none')}>
        <TripEditForm
          trip={trip}
          onSubmit={(next) => {
            setTrip(next)
            setDialog('none')
          }}
          onCancel={() => setDialog('none')}
        />
      </Dialog>
      <Dialog open={dialog === 'addPlace'} title="場所を追加" onClose={() => setDialog('none')}>
        <AddPlaceForm existingPlaces={places} onAdd={handleAdd} onCancel={() => setDialog('none')} />
      </Dialog>
    </div>
  )
}

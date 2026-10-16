import { useMemo, useState } from 'react'

import { Calendar, Clock, Flag, Pencil, Plus, Route } from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { AddPlaceForm, type AddPlaceInput } from '@/components/trip/AddPlaceForm'
import { BudgetCard } from '@/components/trip/BudgetCard'
import { ItineraryCard } from '@/components/trip/ItineraryCard'
import { Timeline } from '@/components/trip/Timeline'
import { TripEditForm } from '@/components/trip/TripEditForm'
import { WarningsCard } from '@/components/trip/WarningsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SideView } from '@/components/ui/SideView'
import { sampleData } from '@/data/sample'
import { DISPLAY_TIME_ZONE, formatDate, formatTime } from '@/lib/format'
import { buildTimeline } from '@/lib/schedule'
import type { Place, Trip, TripPlace } from '@/types'

type Panel = 'none' | 'editTrip' | 'addPlace'

// モック: バックエンド未接続のため、サンプルデータをメモリ上で編集する
export default function App() {
  const firstTrip = sampleData.trips[0]
  const [trip, setTrip] = useState<Trip>(firstTrip)
  const [places, setPlaces] = useState<Place[]>(sampleData.places)
  const [tripPlaces, setTripPlaces] = useState<TripPlace[]>(sampleData.trip_places.filter((tp) => tp.trip_id === firstTrip.id))
  const [panel, setPanel] = useState<Panel>('none')
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
    setPanel('none')
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
    <AppShell crumbs={['旅程', trip.name]}>
      <PageHeader
        title={trip.name}
        badge={
          <Badge tone="primary" icon={Flag} size="md">
            モック
          </Badge>
        }
        meta={[
          { icon: Calendar, text: `${formatDate(start)} ${formatTime(start)} 〜 ${formatDate(end)} ${formatTime(end)}` },
          { icon: Clock, text: DISPLAY_TIME_ZONE },
        ]}
        actions={
          <>
            <Button icon={Pencil} onClick={() => setPanel('editTrip')}>
              旅行を編集
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setPanel('addPlace')}>
              場所を追加
            </Button>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <BudgetCard budget={trip.budget} expenses={expenses} onBudgetChange={(budget) => setTrip((t) => ({ ...t, budget }))} />
        <ItineraryCard items={items} />
        <WarningsCard items={items} />
      </div>

      <Card>
        <CardHeader
          icon={Route}
          title="タイムライン"
          action={
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setPanel('addPlace')}>
              場所を追加
            </Button>
          }
        />
        <CardBody>
          <Timeline items={items} onMove={handleMove} onRemove={handleRemove} onStayChange={handleStayChange} />
        </CardBody>
      </Card>

      <SideView open={panel === 'editTrip'} title="旅行を編集" description="旅行名・期間・予算" onClose={() => setPanel('none')}>
        <TripEditForm
          trip={trip}
          onSubmit={(next) => {
            setTrip(next)
            setPanel('none')
          }}
          onCancel={() => setPanel('none')}
        />
      </SideView>
      <SideView open={panel === 'addPlace'} title="場所を追加" description="タイムラインの末尾に追加する" onClose={() => setPanel('none')}>
        <AddPlaceForm existingPlaces={places} onAdd={handleAdd} onCancel={() => setPanel('none')} />
      </SideView>
    </AppShell>
  )
}

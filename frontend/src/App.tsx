import { useCallback, useMemo, useReducer, useState } from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { AddPlaceForm, type AddPlaceInput } from '@/components/trip/AddPlaceForm'
import { Timeline } from '@/components/trip/Timeline'
import { TripFacts } from '@/components/trip/TripFacts'
import { TripEditForm } from '@/components/trip/TripEditForm'
import { Button } from '@/components/ui/Button'
import { SideView } from '@/components/ui/SideView'
import { sampleData } from '@/data/sample'
import { DISPLAY_TIME_ZONE_LABEL, formatDateTimeLong } from '@/lib/format'
import { buildTimeline } from '@/lib/schedule'
import { initTripState, tripReducer } from '@/lib/tripState'

type Panel = 'none' | 'editTrip' | 'addPlace'

const firstTrip = sampleData.trips[0]
const expenses = sampleData.expenses.filter((e) => e.trip_id === firstTrip.id)

// モック: バックエンド未接続のため、サンプルデータをメモリ上で編集する
export default function App() {
  const [state, dispatch] = useReducer(tripReducer, undefined, () => initTripState(firstTrip, sampleData.places, sampleData.trip_places))
  const [panel, setPanel] = useState<Panel>('none')
  const closePanel = useCallback(() => setPanel('none'), [])

  const { trip, places, tripPlaces } = state
  const items = useMemo(() => buildTimeline(trip, tripPlaces, places), [trip, tripPlaces, places])

  function handleAdd(input: AddPlaceInput) {
    if ('existingPlaceId' in input) {
      dispatch({ type: 'addExisting', placeId: input.existingPlaceId, stayMinutes: input.stayMinutes })
    } else {
      dispatch({ type: 'addNew', place: input.place, stayMinutes: input.stayMinutes })
    }
    closePanel()
  }

  const start = new Date(trip.start_at)
  const end = new Date(trip.end_at)

  return (
    <AppShell nav={[{ label: '旅程', active: true }, { label: '場所' }, { label: '設定' }]}>
      <PageHeader
        title={trip.name}
        meta={`${formatDateTimeLong(start)} – ${formatDateTimeLong(end, false)} · ${DISPLAY_TIME_ZONE_LABEL}`}
        actions={
          <>
            <Button variant="primary" onClick={() => setPanel('addPlace')}>
              場所を追加
            </Button>
            <Button variant="ghost" onClick={() => setPanel('editTrip')}>
              旅行を編集
            </Button>
          </>
        }
      />

      <TripFacts trip={trip} expenses={expenses} />

      <Timeline
        items={items}
        onMove={(id, direction) => dispatch({ type: 'move', tripPlaceId: id, direction })}
        onRemove={(id) => dispatch({ type: 'remove', tripPlaceId: id })}
        onStayChange={(id, stayMinutes) => dispatch({ type: 'setStay', tripPlaceId: id, stayMinutes })}
        onAdd={() => setPanel('addPlace')}
      />

      <p className="text-caption text-fg-subtle">このデータはサンプルです。編集はこのブラウザの中だけに反映され、再読み込みで元に戻ります。</p>

      <SideView open={panel === 'editTrip'} title="旅行を編集" onClose={closePanel}>
        <TripEditForm
          trip={trip}
          onSubmit={(next) => {
            dispatch({ type: 'editTrip', trip: next })
            closePanel()
          }}
          onCancel={closePanel}
        />
      </SideView>
      <SideView open={panel === 'addPlace'} title="場所を追加" onClose={closePanel}>
        <AddPlaceForm existingPlaces={places} onAdd={handleAdd} onCancel={closePanel} />
      </SideView>
    </AppShell>
  )
}

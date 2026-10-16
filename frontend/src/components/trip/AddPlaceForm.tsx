import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Field, Input, Select } from '@/components/ui/Field'
import type { Place } from '@/types'

export const CATEGORIES = [
  { value: 'sightseeing', label: '観光' },
  { value: 'museum', label: '美術館・博物館' },
  { value: 'restaurant', label: '飲食' },
  { value: 'station', label: '駅・空港' },
  { value: 'hotel', label: '宿' },
] as const

export type NewPlaceInput = {
  place: Omit<Place, 'id' | 'fetched_at'>
  stayMinutes: number
}

export type AddPlaceInput = NewPlaceInput | { existingPlaceId: string; stayMinutes: number }

type Props = {
  existingPlaces: Place[]
  onAdd: (input: AddPlaceInput) => void
}

export function AddPlaceForm({ existingPlaces, onAdd }: Props) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const stayMinutes = Number(data.get('stay_minutes') ?? 0)

    if (mode === 'existing') {
      onAdd({ existingPlaceId: String(data.get('place_id')), stayMinutes })
    } else {
      onAdd({
        place: {
          name: String(data.get('name')),
          latitude: Number(data.get('latitude')),
          longitude: Number(data.get('longitude')),
          category: String(data.get('category')) || null,
          opening_hours: null,
        },
        stayMinutes,
      })
    }
    form.reset()
  }

  return (
    <Card>
      <CardHeader
        title="場所を追加"
        action={
          <div className="flex rounded-lg bg-neutral-100 p-0.5 text-[12px]">
            {(
              [
                ['existing', '登録済みから'],
                ['new', '新しく入力'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={
                  mode === value
                    ? 'rounded-md bg-white px-2.5 py-1 font-medium shadow-sm'
                    : 'rounded-md px-2.5 py-1 text-neutral-500 hover:text-ink'
                }
              >
                {label}
              </button>
            ))}
          </div>
        }
      />
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'existing' ? (
            <Field label="場所" hint="Phase 2 では検索で候補を出す。今は登録済みの場所から選ぶ">
              <Select name="place_id" required>
                {existingPlaces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <>
              <Field label="場所名">
                <Input name="name" placeholder="例: ヴェネツィア・サンタ・ルチア駅" required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="緯度">
                  <Input name="latitude" type="number" step="any" placeholder="45.4410" required />
                </Field>
                <Field label="経度">
                  <Input name="longitude" type="number" step="any" placeholder="12.3210" required />
                </Field>
              </div>
              <Field label="カテゴリ">
                <Select name="category" defaultValue="sightseeing">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}
          <Field label="滞在時間(分)" hint="駅など通過するだけなら 0">
            <Input name="stay_minutes" type="number" min={0} step={5} defaultValue={60} required />
          </Field>
          <div className="flex justify-end pt-1">
            <Button variant="primary" type="submit">
              末尾に追加
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

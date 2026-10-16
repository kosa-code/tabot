import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Field'
import { CATEGORIES } from '@/lib/categories'
import { cn } from '@/lib/cn'
import type { Place } from '@/types'

export type NewPlaceInput = {
  place: Omit<Place, 'id' | 'fetched_at'>
  stayMinutes: number
}

export type AddPlaceInput = NewPlaceInput | { existingPlaceId: string; stayMinutes: number }

type Props = {
  existingPlaces: Place[]
  onAdd: (input: AddPlaceInput) => void
  onCancel: () => void
}

export function AddPlaceForm({ existingPlaces, onAdd, onCancel }: Props) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex rounded-xl bg-neutral-100 p-0.5 text-small">
        {(
          [
            ['existing', '登録済みから選ぶ'],
            ['new', '新しく入力する'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              'flex-1 rounded-[10px] px-3 py-2',
              mode === value ? 'bg-white font-medium shadow-sm' : 'text-fg-muted hover:text-fg-strong',
            )}
          >
            {label}
          </button>
        ))}
      </div>

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
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
        <Button variant="primary" type="submit">
          末尾に追加
        </Button>
      </div>
    </form>
  )
}

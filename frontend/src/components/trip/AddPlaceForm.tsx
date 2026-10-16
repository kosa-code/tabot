import { useState, type FormEvent } from 'react'

import { Field, FieldRow, Input, Select } from '@/components/ui/Field'
import { Form, FormActions } from '@/components/ui/Form'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { CATEGORIES, type CategoryValue } from '@/lib/categories'
import type { NewPlace } from '@/lib/tripState'
import type { Place } from '@/types'

export type AddPlaceInput = { place: NewPlace; stayMinutes: number } | { existingPlaceId: string; stayMinutes: number }

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
          category: (String(data.get('category')) || null) as CategoryValue | null,
          opening_hours: null,
        },
        stayMinutes,
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <SegmentedControl
        label="場所の指定方法"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'existing', label: '登録済みから選ぶ' },
          { value: 'new', label: '新しく入力する' },
        ]}
      />

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
          <FieldRow>
            <Field label="緯度">
              <Input name="latitude" type="number" step="any" placeholder="45.4410" required />
            </Field>
            <Field label="経度">
              <Input name="longitude" type="number" step="any" placeholder="12.3210" required />
            </Field>
          </FieldRow>
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
        <Input name="stay_minutes" type="number" inputMode="numeric" min={0} step={5} defaultValue={60} required />
      </Field>
      <FormActions submitLabel="末尾に追加" onCancel={onCancel} />
    </Form>
  )
}

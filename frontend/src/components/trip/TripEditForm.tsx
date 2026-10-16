import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { toLocalInputValue } from '@/lib/format'
import type { Trip } from '@/types'

// datetime-local の値(表示タイムゾーン基準)をISO文字列に戻す。モックなので固定オフセット
function fromLocalInputValue(value: string): string {
  return `${value}:00+01:00`
}

type Props = {
  trip: Trip
  onSubmit: (trip: Trip) => void
  onCancel: () => void
}

export function TripEditForm({ trip, onSubmit, onCancel }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const budget = String(form.get('budget') ?? '').trim()
    onSubmit({
      ...trip,
      name: String(form.get('name')),
      start_at: fromLocalInputValue(String(form.get('start_at'))),
      end_at: fromLocalInputValue(String(form.get('end_at'))),
      budget: budget === '' ? null : Number(budget),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="旅行名">
        <Input name="name" defaultValue={trip.name} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="開始">
          <Input name="start_at" type="datetime-local" defaultValue={toLocalInputValue(trip.start_at)} required />
        </Field>
        <Field label="終了">
          <Input name="end_at" type="datetime-local" defaultValue={toLocalInputValue(trip.end_at)} required />
        </Field>
      </div>
      <Field label="予算(円)" hint="未定なら空のまま">
        <Input name="budget" type="number" min={0} step={1000} defaultValue={trip.budget ?? ''} />
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
        <Button variant="primary" type="submit">
          保存
        </Button>
      </div>
    </form>
  )
}

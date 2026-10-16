import { useState, type FormEvent } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Field'
import { DISPLAY_TIME_ZONE, formatDate, formatTime, formatYen, toLocalInputValue } from '@/lib/format'
import type { Trip } from '@/types'

type Props = {
  trip: Trip
  onChange: (trip: Trip) => void
}

// datetime-local の値(表示タイムゾーン基準)をISO文字列に戻す。モックなので固定オフセット
function fromLocalInputValue(value: string): string {
  return `${value}:00+01:00`
}

export function TripCard({ trip, onChange }: Props) {
  const [editing, setEditing] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const budget = String(form.get('budget') ?? '').trim()
    onChange({
      ...trip,
      name: String(form.get('name')),
      start_at: fromLocalInputValue(String(form.get('start_at'))),
      end_at: fromLocalInputValue(String(form.get('end_at'))),
      budget: budget === '' ? null : Number(budget),
    })
    setEditing(false)
  }

  const start = new Date(trip.start_at)
  const end = new Date(trip.end_at)

  return (
    <Card>
      <CardHeader
        title="旅行"
        action={
          !editing && (
            <Button size="sm" onClick={() => setEditing(true)}>
              編集
            </Button>
          )
        }
      />
      <CardBody>
        {editing ? (
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
              <Button variant="ghost" onClick={() => setEditing(false)}>
                キャンセル
              </Button>
              <Button variant="primary" type="submit">
                保存
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <h1 className="text-[20px] font-semibold tracking-[-0.01em]">{trip.name}</h1>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
              <dt className="text-neutral-500">期間</dt>
              <dd>
                {formatDate(start)} {formatTime(start)} 〜 {formatDate(end)} {formatTime(end)}
              </dd>
              <dt className="text-neutral-500">予算</dt>
              <dd>{formatYen(trip.budget)}</dd>
              <dt className="text-neutral-500">表示時刻</dt>
              <dd>
                <Badge>{DISPLAY_TIME_ZONE}</Badge>
              </dd>
            </dl>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

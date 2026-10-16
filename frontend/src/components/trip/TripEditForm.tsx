import type { FormEvent } from 'react'

import { Field, FieldRow, Input } from '@/components/ui/Field'
import { Form, FormActions } from '@/components/ui/Form'
import { fromLocalInputValue, toLocalInputValue } from '@/lib/format'
import type { Trip } from '@/types'

type Props = {
  trip: Trip
  onSubmit: (trip: Trip) => void
  onCancel: () => void
}

export function TripEditForm({ trip, onSubmit, onCancel }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const start = String(form.get('start_at'))
    const end = String(form.get('end_at'))
    if (end < start) {
      e.currentTarget.querySelector<HTMLInputElement>('[name=end_at]')?.setCustomValidity('終了は開始より後にしてください')
      e.currentTarget.reportValidity()
      return
    }
    const budget = String(form.get('budget') ?? '').trim()
    onSubmit({
      ...trip,
      name: String(form.get('name')),
      start_at: fromLocalInputValue(start),
      end_at: fromLocalInputValue(end),
      budget: budget === '' ? null : Number(budget),
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field label="旅行名">
        <Input name="name" defaultValue={trip.name} required />
      </Field>
      <FieldRow>
        <Field label="開始">
          <Input name="start_at" type="datetime-local" defaultValue={toLocalInputValue(trip.start_at)} required />
        </Field>
        <Field label="終了">
          <Input name="end_at" type="datetime-local" defaultValue={toLocalInputValue(trip.end_at)} required onInput={(e) => e.currentTarget.setCustomValidity('')} />
        </Field>
      </FieldRow>
      <Field label="予算(円)" hint="未定なら空のまま">
        <Input name="budget" type="number" inputMode="numeric" min={0} step={1000} defaultValue={trip.budget ?? ''} />
      </Field>
      <FormActions submitLabel="保存" onCancel={onCancel} />
    </Form>
  )
}

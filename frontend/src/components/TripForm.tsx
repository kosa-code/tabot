import { useState, type FormEvent } from 'react'
import type { TripCreate } from '../types/schemas'
import Alert from './Alert'
import Button from './Button'
import Input from './Input'

type Props = {
  submitLabel: string
  onSubmit: (payload: TripCreate) => Promise<void>
}

function TripForm({ submitLabel, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [budget, setBudget] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const start = new Date(startAt)
    const end = new Date(endAt)
    if (end <= start) {
      setError('終了は開始より後にしてください')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        name,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        budget: budget === '' ? null : Number(budget),
      })
    } catch (e) {
      setError((e as Error).message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert>{error}</Alert>}
      <Input label="旅行名" value={name} onChange={setName} required />
      <Input
        label="開始"
        type="datetime-local"
        value={startAt}
        onChange={setStartAt}
        required
      />
      <Input
        label="終了"
        type="datetime-local"
        value={endAt}
        onChange={setEndAt}
        required
      />
      <Input
        label="予算（円・任意）"
        type="number"
        value={budget}
        onChange={setBudget}
      />
      <Button type="submit" disabled={saving}>
        {saving ? '保存中…' : submitLabel}
      </Button>
    </form>
  )
}

export default TripForm

import { useState, type FormEvent } from 'react'
import type { Place, TripPlaceCreate } from '../types/schemas'
import Alert from './Alert'
import Button from './Button'
import Input from './Input'
import Message from './Message'
import Select from './Select'

type Props = {
  places: Place[]
  onAdd: (payload: TripPlaceCreate) => Promise<void>
}

function AddTripPlaceForm({ places, onAdd }: Props) {
  const [placeId, setPlaceId] = useState('')
  const [stay, setStay] = useState('60')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onAdd({ place_id: placeId, stay_minutes: Number(stay) })
      setPlaceId('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-gray-900">旅程を追加</h2>
      {error && <Alert>{error}</Alert>}
      {places.length === 0 ? (
        <Message>登録済みの場所がありません</Message>
      ) : (
        <>
          <Select
            label="場所"
            value={placeId}
            onChange={setPlaceId}
            options={places.map((p) => ({ value: p.id, label: p.name }))}
            required
          />
          <Input
            label="滞在時間（分）"
            type="number"
            value={stay}
            onChange={setStay}
            required
          />
          <Button type="submit" disabled={saving}>
            {saving ? '追加中…' : '追加する'}
          </Button>
        </>
      )}
    </form>
  )
}

export default AddTripPlaceForm

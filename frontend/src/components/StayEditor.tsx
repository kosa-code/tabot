import { useState, type FormEvent } from 'react'
import Alert from './Alert'
import Button from './Button'
import Input from './Input'

type Props = {
  minutes: number
  onSave?: (minutes: number) => Promise<void>
}

function StayEditor({ minutes, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(minutes))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setValue(String(minutes))
    setError(null)
    setEditing(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!onSave) return
    setError(null)
    setSaving(true)
    try {
      await onSave(Number(value))
      setEditing(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">滞在{minutes}分</p>
        {onSave && (
          <Button variant="secondary" onClick={startEdit}>
            変更
          </Button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      {error && <Alert>{error}</Alert>}
      <Input
        label="滞在時間（分）"
        type="number"
        value={value}
        onChange={setValue}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中…' : '保存'}
        </Button>
        <Button variant="secondary" onClick={() => setEditing(false)}>
          やめる
        </Button>
      </div>
    </form>
  )
}

export default StayEditor

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { Input } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { FOCUS_RING } from '@/lib/ui'

type Props = {
  /** 表示するときの文字 */
  display: string
  /** 編集するときの初期値 */
  value: number | null
  /** 読み上げ用。「○○を編集」になる */
  label: string
  onCommit: (value: number | null) => void
  min?: number
  step?: number
  /** 空を許すか(null で確定する) */
  allowEmpty?: boolean
  className?: string
}

/**
 * 表示 → クリックで入力に変わる数値の編集。文字と同じ見た目で、ホバーで下線が出る。
 * Enter / blur で確定、Esc で取り消し。入力欄を常時表示しない(docs/ui.md)
 */
export function InlineEdit({ display, value, label, onCommit, min = 0, step = 1, allowEmpty = false, className }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function start() {
    setDraft(value == null ? '' : String(value))
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed === '') {
      if (allowEmpty) onCommit(null)
    } else {
      const n = Number(trimmed)
      if (!Number.isNaN(n)) onCommit(Math.max(min, n))
    }
    setEditing(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    }
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        size="sm"
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        aria-label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={cn('w-16 text-right', className)}
      />
    )
  }

  return (
    <button
      type="button"
      aria-label={`${label}を編集`}
      onClick={start}
      className={cn('border-b border-transparent text-fg-muted tabular-nums transition-colors hover:border-neutral-300 hover:text-fg-strong', FOCUS_RING, className)}
    >
      {display}
    </button>
  )
}

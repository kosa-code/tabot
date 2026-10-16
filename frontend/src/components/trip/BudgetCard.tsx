import { Check, Info, Pencil, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Field'
import { IconButton } from '@/components/ui/IconButton'
import { HATCHED, SegmentBar } from '@/components/ui/SegmentBar'
import { Stat } from '@/components/ui/Stat'
import { formatYen } from '@/lib/format'
import { ICON } from '@/lib/ui'
import type { Expense } from '@/types'

type Props = {
  budget: number | null
  expenses: Expense[]
  onBudgetChange: (budget: number | null) => void
}

export function BudgetCard({ budget, expenses, onBudgetChange }: Props) {
  const [editing, setEditing] = useState(false)
  const spent = expenses.reduce((n, e) => n + e.amount, 0)
  const ratio = budget && budget > 0 ? Math.min(spent / budget, 1) : 0
  const remaining = budget == null ? null : budget - spent

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const raw = String(new FormData(e.currentTarget).get('budget') ?? '').trim()
    onBudgetChange(raw === '' ? null : Number(raw))
    setEditing(false)
  }

  return (
    <Card>
      <CardHeader
        title="予算"
        subtitle="支出の合計と予算の比較"
        action={
          <span className="text-fg-subtle" title="支出は Phase 3 で登録できるようになる(今はサンプル)">
            <Info size={ICON.lg} />
          </span>
        }
      />
      <CardBody>
        <Stat value={formatYen(spent)} />
        <p className="mt-2 text-small text-fg-muted">
          {remaining == null ? (
            '予算が未設定です'
          ) : remaining >= 0 ? (
            <>
              <span className="font-medium text-emerald-600">残り {formatYen(remaining)}</span> · {expenses.length} 件の支出
            </>
          ) : (
            <>
              <span className="font-medium text-red-600">{formatYen(-remaining)} 超過</span> · {expenses.length} 件の支出
            </>
          )}
        </p>

        <div className="mt-5">
          <SegmentBar height="md" fillRemainder label="予算の消化率" segments={[{ ratio, className: `bg-primary ${HATCHED}` }]} />
        </div>

        <div className="mt-auto flex items-center justify-between pt-5 text-small">
          <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="size-2 rounded-full bg-primary ring-2 ring-primary/30" />
            予算
          </span>
          {editing ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-1">
              <Input name="budget" type="number" min={0} step={1000} defaultValue={budget ?? ''} className="h-7 w-24 px-2 text-right" autoFocus />
              <Button size="sm" variant="primary" type="submit" icon={Check} aria-label="保存" />
              <IconButton icon={X} label="キャンセル" onClick={() => setEditing(false)} />
            </form>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1 text-fg-muted hover:text-fg-strong">
              <span className="tabular-nums">{formatYen(budget)}</span>
              <Pencil size={ICON.sm} />
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

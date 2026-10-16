import { useState, type FormEvent } from 'react'

import { Check, Info, Pencil, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { ShellCard } from '@/components/ui/ShellCard'
import { formatYen } from '@/lib/format'
import type { Expense } from '@/types'

type Props = {
  budget: number | null
  expenses: Expense[]
  onBudgetChange: (budget: number | null) => void
}

const HATCH =
  'bg-[repeating-linear-gradient(115deg,transparent_0_10px,rgba(255,255,255,0.35)_10px_12px)]'

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
    <ShellCard
      title="予算"
      action={
        <span className="text-neutral-400" title="支出の合計と予算の比較。支出は Phase 3 で登録できるようになる(今はサンプル)">
          <Info />
        </span>
      }
    >
      <div className="flex h-full flex-col">
        <div className="text-[28px] leading-none font-semibold tracking-[-0.02em] tabular-nums">{formatYen(spent)}</div>
        <div className="mt-2 text-[13px] text-neutral-500">
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
        </div>

        <div className="mt-5 flex h-7 gap-1.5" role="progressbar" aria-valuenow={Math.round(ratio * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`rounded-lg bg-primary transition-[flex-basis] ${HATCH}`}
            style={{ flexBasis: `${ratio * 100}%` }}
          />
          {ratio < 1 && <div className="flex-1 rounded-lg bg-neutral-100" />}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5 text-[13px]">
          <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="size-2.5 rounded-full bg-primary ring-2 ring-primary/30" />
            予算
          </span>
          {editing ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
              <Input name="budget" type="number" min={0} step={1000} defaultValue={budget ?? ''} className="h-7 w-24 px-2 text-right" autoFocus />
              <Button size="sm" variant="primary" type="submit" aria-label="保存">
                <Check size={14} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)} aria-label="キャンセル">
                <X size={14} />
              </Button>
            </form>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-neutral-500 hover:text-ink">
              <span className="tabular-nums">{formatYen(budget)}</span>
              <Pencil size={15} />
            </button>
          )}
        </div>
      </div>
    </ShellCard>
  )
}

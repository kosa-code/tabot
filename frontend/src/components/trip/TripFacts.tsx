import { FactList, type Fact } from '@/components/ui/FactList'
import { cn } from '@/lib/cn'
import { formatDate, formatYen, tripDays } from '@/lib/format'
import type { Expense, Trip } from '@/types'

type Props = {
  trip: Trip
  expenses: Expense[]
}

/** 期間と予算の2つだけ。行程と注意はタイムラインで分かる */
export function TripFacts({ trip, expenses }: Props) {
  const start = new Date(trip.start_at)
  const end = new Date(trip.end_at)
  const spent = expenses.reduce((n, e) => n + e.amount, 0)
  const over = trip.budget != null && spent > trip.budget
  const ratio = trip.budget ? Math.min(spent / trip.budget, 1) : 0

  const facts: Fact[] = [
    {
      label: '期間',
      value: `${formatDate(start)}〜${formatDate(end)}`,
      note: `${tripDays(start, end)}日間`,
    },
    {
      label: '予算',
      value: (
        <>
          {formatYen(spent)}
          {trip.budget != null && <span className="text-fg-muted"> / {formatYen(trip.budget)}</span>}
        </>
      ),
      note:
        trip.budget != null ? (
          <span role="img" aria-label={`予算の${Math.round(ratio * 100)}%を使用`} className="block h-0.5 w-full max-w-xs bg-neutral-200">
            <span className={cn('block h-full', over ? 'bg-primary' : 'bg-secondary')} style={{ width: `${ratio * 100}%` }} />
          </span>
        ) : (
          '未設定'
        ),
    },
  ]

  return <FactList facts={facts} />
}

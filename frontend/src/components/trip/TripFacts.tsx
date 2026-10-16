import { FactList, type Fact } from '@/components/ui/FactList'
import { cn } from '@/lib/cn'
import { formatDate, formatMinutes, formatYen, tripDays } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'
import { FOCUS_RING } from '@/lib/ui'
import type { Expense, Trip } from '@/types'

type Props = {
  trip: Trip
  items: TimelineItem[]
  expenses: Expense[]
  /** 注意の件数を押したときに最初の警告へ移動する */
  onJumpToWarning?: () => void
}

/** 期間・行程・予算・注意の4つを一行で。詳細はタイムラインにある */
export function TripFacts({ trip, items, expenses, onJumpToWarning }: Props) {
  const start = new Date(trip.start_at)
  const end = new Date(trip.end_at)
  const travel = items.reduce((n, i) => n + i.travelMinutes, 0)
  const stay = items.reduce((n, i) => n + i.tripPlace.stay_minutes, 0)
  const spent = expenses.reduce((n, e) => n + e.amount, 0)
  const over = trip.budget != null && spent > trip.budget
  const ratio = trip.budget ? Math.min(spent / trip.budget, 1) : 0
  const warningCount = items.reduce((n, i) => n + i.warnings.length, 0)

  const facts: Fact[] = [
    {
      label: '期間',
      value: `${formatDate(start)}〜${formatDate(end)}`,
      note: `${tripDays(start, end)}日間`,
    },
    {
      label: '行程',
      value: `${items.length}箇所`,
      note: `移動 ${formatMinutes(travel)} · 滞在 ${formatMinutes(stay)}`,
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
          <span role="img" aria-label={`予算の${Math.round(ratio * 100)}%を使用`} className="block h-0.5 w-full bg-neutral-200">
            <span className={cn('block h-full', over ? 'bg-primary' : 'bg-secondary')} style={{ width: `${ratio * 100}%` }} />
          </span>
        ) : (
          '未設定'
        ),
    },
    {
      label: '注意',
      value:
        warningCount === 0 ? (
          <span className="text-fg-muted">なし</span>
        ) : (
          <button type="button" onClick={onJumpToWarning} className={cn('rounded-lg text-primary hover:underline', FOCUS_RING)}>
            {warningCount}件
          </button>
        ),
      note: warningCount > 0 ? '営業時間・終了時刻' : undefined,
    },
  ]

  return <FactList facts={facts} />
}

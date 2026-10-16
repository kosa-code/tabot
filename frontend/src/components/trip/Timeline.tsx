import { ArrowDown, ArrowUp, Check, Clock, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'

import { Badge } from '@/components/ui/Badge'
import { findCategory } from '@/lib/categories'
import { cn } from '@/lib/cn'
import { ICON } from '@/lib/ui'
import { dateKey, formatDate, formatMinutes, formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

type Props = {
  items: TimelineItem[]
  onMove: (tripPlaceId: string, direction: -1 | 1) => void
  onRemove: (tripPlaceId: string) => void
  onStayChange: (tripPlaceId: string, stayMinutes: number) => void
}

function CategoryBadge({ value }: { value: string | null }) {
  const c = findCategory(value)
  if (!c) return null
  return (
    <Badge tone={c.tone} icon={c.icon} size="md">
      {c.label}
    </Badge>
  )
}

function IconButton({ icon: IconComponent, label, disabled, danger, onClick }: { icon: LucideIcon; label: string; disabled?: boolean; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-lg transition-colors disabled:opacity-30',
        danger ? 'text-fg-subtle hover:bg-red-50 hover:text-red-600' : 'text-fg-subtle hover:bg-secondary-light/25 hover:text-secondary-dark',
      )}
    >
      <IconComponent size={ICON.md} />
    </button>
  )
}

export function Timeline({ items, onMove, onRemove, onStayChange }: Props) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-small text-fg-muted">まだ場所がありません。「場所を追加」から登録してください。</p>
  }

  const last = items[items.length - 1]

  return (
    // 左のレール(縦線)に沿って、日付は大きな丸、各地点は小さな丸で並べる
    <ol className="relative ml-4 border-l-2 border-neutral-200 pl-7 py-1">
      {items.map((item, index) => {
        const prev = items[index - 1]
        const newDay = !prev || dateKey(prev.arrive) !== dateKey(item.arrive)
        const hasWarning = item.warnings.length > 0
        return (
          <Fragment key={item.tripPlace.id}>
            {index > 0 && (
              <li className="flex items-center gap-1 py-2 text-small text-fg-subtle">
                <Clock size={ICON.xs} />
                移動 {formatMinutes(item.travelMinutes)}
              </li>
            )}
            {newDay && (
              <li className={cn('relative', index > 0 ? 'pt-5 pb-2' : 'pb-2')}>
                <span
                  aria-hidden
                  className="absolute top-1/2 -left-7 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-400 bg-white"
                  style={{ marginTop: index > 0 ? 6 : -1 }}
                />
                <span className="text-title font-semibold text-fg-strong">{formatDate(item.arrive)}</span>
              </li>
            )}
            <li className="group relative -ml-2 flex gap-3 rounded-2xl py-2 pr-1 pl-2 transition-colors hover:bg-neutral-50">
              <span
                aria-hidden
                className={cn(
                  'absolute top-[17px] -left-5 size-3 -translate-x-1/2 rounded-full border-2 bg-white',
                  hasWarning ? 'border-primary' : 'border-neutral-300',
                )}
              />
              <div className="w-12 shrink-0 pt-1 text-right tabular-nums">
                <div className="text-body font-semibold text-fg-strong">{formatTime(item.arrive)}</div>
                {item.tripPlace.stay_minutes > 0 && <div className="text-caption text-fg-subtle">{formatTime(item.depart)}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-medium text-fg-strong">{item.place.name}</span>
                  <CategoryBadge value={item.place.category} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-fg-muted">
                  <label className="flex items-center gap-1">
                    滞在
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={item.tripPlace.stay_minutes}
                      onChange={(e) => onStayChange(item.tripPlace.id, Number(e.target.value))}
                      className="h-6 w-16 rounded-md border border-neutral-200 bg-white px-2 text-right tabular-nums focus:border-secondary focus:outline-none"
                    />
                    分
                  </label>
                  {item.place.opening_hours === null && <span>営業時間: 未登録</span>}
                </div>
                {hasWarning && (
                  <ul className="mt-2 space-y-1">
                    {item.warnings.map((w) => (
                      <li key={w} className="flex items-center gap-1 text-small text-primary">
                        <TriangleAlert size={ICON.sm} />
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <IconButton icon={ArrowUp} label="上へ" disabled={index === 0} onClick={() => onMove(item.tripPlace.id, -1)} />
                <IconButton icon={ArrowDown} label="下へ" disabled={index === items.length - 1} onClick={() => onMove(item.tripPlace.id, 1)} />
                <IconButton icon={X} label="削除" danger onClick={() => onRemove(item.tripPlace.id)} />
              </div>
            </li>
          </Fragment>
        )
      })}
      <li className="relative pt-5">
        <span
          aria-hidden
          className="absolute -left-7 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-fg-inverse"
          style={{ marginTop: 1 }}
        >
          <Check size={ICON.xs} strokeWidth={3} />
        </span>
        <span className="text-small text-fg-muted">
          最終地点を出発 <span className="font-semibold text-fg-strong tabular-nums">{formatTime(last.depart)}</span>
        </span>
      </li>
    </ol>
  )
}

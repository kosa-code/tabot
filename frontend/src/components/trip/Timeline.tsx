import { ArrowDown, ArrowUp, Check, Clock, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'

import { Badge } from '@/components/ui/Badge'
import { findCategory } from '@/lib/categories'
import { cn } from '@/lib/cn'
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
        danger ? 'text-neutral-400 hover:bg-red-50 hover:text-red-600' : 'text-neutral-400 hover:bg-secondary-light/25 hover:text-secondary-dark',
      )}
    >
      <IconComponent size={15} />
    </button>
  )
}

export function Timeline({ items, onMove, onRemove, onStayChange }: Props) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-[13px] text-neutral-500">まだ場所がありません。「場所を追加」から登録してください。</p>
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
              <li className="flex items-center gap-1 py-1.5 text-[12px] text-neutral-400">
                <Clock size={12} />
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
                <span className="text-[15px] font-semibold">{formatDate(item.arrive)}</span>
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
              <div className="w-12 shrink-0 pt-0.5 text-right tabular-nums">
                <div className="text-[14px] font-semibold">{formatTime(item.arrive)}</div>
                {item.tripPlace.stay_minutes > 0 && <div className="text-[11px] text-neutral-400">{formatTime(item.depart)}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-medium">{item.place.name}</span>
                  <CategoryBadge value={item.place.category} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
                  <label className="flex items-center gap-1">
                    滞在
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={item.tripPlace.stay_minutes}
                      onChange={(e) => onStayChange(item.tripPlace.id, Number(e.target.value))}
                      className="h-6 w-16 rounded-md border border-neutral-200 bg-white px-1.5 text-right tabular-nums focus:border-secondary focus:outline-none"
                    />
                    分
                  </label>
                  {item.place.opening_hours === null && <span>営業時間: 未登録</span>}
                </div>
                {hasWarning && (
                  <ul className="mt-1.5 space-y-0.5">
                    {item.warnings.map((w) => (
                      <li key={w} className="flex items-center gap-1 text-[12px] text-primary">
                        <TriangleAlert size={13} />
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
          className="absolute -left-7 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-white"
          style={{ marginTop: 1 }}
        >
          <Check size={12} strokeWidth={3} />
        </span>
        <span className="text-[13px] text-neutral-500">
          最終地点を出発 <span className="font-semibold text-ink tabular-nums">{formatTime(last.depart)}</span>
        </span>
      </li>
    </ol>
  )
}

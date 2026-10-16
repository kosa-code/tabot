import { ShellCard } from '@/components/ui/ShellCard'
import { formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

import { Clock, TriangleAlert } from 'lucide-react'
import { ICON } from '@/lib/ui'

export function WarningsCard({ items }: { items: TimelineItem[] }) {
  const warnings = items.flatMap((item) => item.warnings.map((text) => ({ item, text })))

  return (
    <ShellCard icon={TriangleAlert} title="注意" subtitle="営業時間と制約のチェック">
      <div className="flex h-full flex-col">
        <div className="text-display font-semibold text-fg-strong tabular-nums">
          {warnings.length} <span className="text-title font-medium text-fg-muted">件</span>
        </div>
        {warnings.length === 0 ? (
          <p className="mt-4 text-small text-fg-muted">問題はありません。</p>
        ) : (
          <ul className="mt-4 space-y-3 text-small">
            {warnings.slice(0, 4).map(({ item, text }, i) => (
              <li key={i} className="flex items-start gap-2">
                <TriangleAlert size={ICON.md} className="mt-1 shrink-0 text-primary-light" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{item.place.name}</div>
                  <div className="text-fg-muted">{text}</div>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-fg-subtle tabular-nums">
                  <Clock size={ICON.sm} />
                  {formatTime(item.arrive)}
                </span>
              </li>
            ))}
            {warnings.length > 4 && <li className="text-small text-fg-subtle">ほか {warnings.length - 4} 件</li>}
          </ul>
        )}
      </div>
    </ShellCard>
  )
}

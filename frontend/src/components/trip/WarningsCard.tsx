import { Clock, TriangleAlert } from 'lucide-react'

import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Stat } from '@/components/ui/Stat'
import { formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'
import { ICON } from '@/lib/ui'

export function WarningsCard({ items }: { items: TimelineItem[] }) {
  const warnings = items.flatMap((item) => item.warnings.map((text) => ({ item, text })))

  return (
    <Card>
      <CardHeader icon={TriangleAlert} title="注意" subtitle="営業時間と制約のチェック" />
      <CardBody>
        <Stat value={warnings.length} unit="件" />
        {warnings.length === 0 ? (
          <p className="mt-4 text-small text-fg-muted">問題はありません。</p>
        ) : (
          <ul className="mt-4 space-y-3 text-small">
            {warnings.slice(0, 4).map(({ item, text }, i) => (
              <li key={i} className="flex items-start gap-2">
                <TriangleAlert size={ICON.sm} className="mt-1 shrink-0 text-primary-light" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-fg-strong">{item.place.name}</div>
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
      </CardBody>
    </Card>
  )
}

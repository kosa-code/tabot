import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { ICON } from '@/lib/ui'

export type PageMeta = { icon: LucideIcon; text: string }

type Props = {
  title: string
  badge?: ReactNode
  meta?: PageMeta[]
  actions?: ReactNode
}

/** 画面の見出し。タイトル、補足情報、右側の操作 */
export function PageHeader({ title, badge, meta = [], actions }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-heading font-semibold text-fg-strong">{title}</h1>
          {badge}
        </div>
        {meta.length > 0 && (
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-fg-muted">
            {meta.map(({ icon: IconComponent, text }) => (
              <span key={text} className="flex items-center gap-1">
                <IconComponent size={ICON.sm} />
                {text}
              </span>
            ))}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

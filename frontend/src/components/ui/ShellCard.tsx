import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  icon?: LucideIcon
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/** 灰色の外枠に見出しを置き、白い内側に中身を入れるカード */
export function ShellCard({ icon: IconComponent, title, subtitle, action, className, bodyClassName, children }: Props) {
  return (
    <section className={cn('flex flex-col rounded-[22px] border border-neutral-200/70 bg-neutral-50 p-2', className)}>
      <header className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          {IconComponent && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <IconComponent size={18} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-semibold">{title}</h2>
            {subtitle && <p className="truncate text-[12px] text-neutral-500">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn('flex-1 rounded-2xl border border-neutral-200/60 bg-white p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

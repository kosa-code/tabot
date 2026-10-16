import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { ICON } from '@/lib/ui'

/** 白い一重のカード。見出し(CardHeader)と本文(CardBody)を中に置く */
export function Card({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn('flex flex-col rounded-2xl border border-neutral-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]', className)}
      {...rest}
    />
  )
}

type HeaderProps = {
  icon?: LucideIcon
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ icon: IconComponent, title, subtitle, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {IconComponent && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary-light/20 text-secondary">
            <IconComponent size={ICON.lg} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-title font-semibold text-fg-strong">{title}</h2>
          {subtitle && <p className="truncate text-small text-fg-muted">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-1 flex-col p-4', className)} {...rest} />
}

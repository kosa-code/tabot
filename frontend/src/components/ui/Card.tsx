import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

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
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-title font-semibold text-fg-strong">{title}</h2>
        {subtitle && <p className="truncate text-small text-fg-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-1 flex-col p-4', className)} {...rest} />
}

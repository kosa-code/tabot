import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn('rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]', className)}
      {...rest}
    />
  )
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {action}
    </header>
  )
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...rest} />
}

import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { FOCUS_RING } from '@/lib/ui'

export type NavLink = { label: string; active?: boolean }

type Props = {
  nav: NavLink[]
  children: ReactNode
}

// ルーティング導入までは押せない。導入時に <a href> に差し替える
function NavItem({ label, active }: NavLink) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'border-b pb-1 text-small transition-colors',
        FOCUS_RING,
        active ? 'border-secondary-dark text-fg-strong' : 'border-transparent text-fg-muted hover:text-fg-strong',
      )}
    >
      {label}
    </button>
  )
}

/** 一面の地に、1行の上部バーと本文。枠線や影で領域を作らない */
export function AppShell({ nav, children }: Props) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-16">
        <span className="text-title text-fg-strong">tabot</span>
        <nav aria-label="メニュー" className="flex items-center gap-6">
          {nav.map((n) => (
            <NavItem key={n.label} {...n} />
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl space-y-12 px-6 pt-16 pb-24 lg:px-16">{children}</main>
    </div>
  )
}

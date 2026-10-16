import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { FOCUS_RING } from '@/lib/ui'

export type NavLink = { label: string; active?: boolean }

type Props = {
  nav: NavLink[]
  children: ReactNode
}

// ルーティング導入までは押せない。導入時に <a href> に差し替える
function NavItem({ label, active, size }: NavLink & { size: 'lg' | 'sm' }) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'block rounded-lg text-left transition-colors',
        FOCUS_RING,
        size === 'lg' ? 'text-title' : 'text-body',
        active ? 'text-primary' : 'text-fg-strong hover:text-fg-muted',
      )}
    >
      {label}
    </button>
  )
}

/** 一面の地に、左のナビと本文。ワードマークは置かず、枠線や影で領域を作らない */
export function AppShell({ nav, children }: Props) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col px-12 pt-16 lg:flex">
        <nav aria-label="メニュー" className="space-y-8">
          {nav.map((n) => (
            <NavItem key={n.label} {...n} size="lg" />
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="px-6 pt-8 lg:hidden">
          <nav aria-label="メニュー" className="flex gap-6">
            {nav.map((n) => (
              <NavItem key={n.label} {...n} size="sm" />
            ))}
          </nav>
        </header>
        <main className="max-w-5xl space-y-12 px-6 pt-16 pb-24 lg:pr-24 lg:pl-16">{children}</main>
      </div>
    </div>
  )
}

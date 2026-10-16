import { Bell, Route, User } from 'lucide-react'
import { ICON } from '@/lib/ui'


export function TopBar({ crumbs }: { crumbs: string[] }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white px-6">
      <nav className="flex items-center gap-2 text-body">
        <Route size={ICON.md} className="text-fg-subtle" />
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <span className="text-fg-subtle">/</span>}
            <span className={i === crumbs.length - 1 ? 'font-medium text-fg-strong' : 'text-fg-muted'}>{c}</span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3 text-fg-muted">
        <span className="relative">
          <Bell size={ICON.lg} />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
          <User size={ICON.md} />
        </span>
      </div>
    </header>
  )
}

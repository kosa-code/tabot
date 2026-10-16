import { Bell, Route, User } from 'lucide-react'


export function TopBar({ crumbs }: { crumbs: string[] }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white px-6">
      <nav className="flex items-center gap-2 text-[14px]">
        <Route size={16} className="text-neutral-400" />
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-300">/</span>}
            <span className={i === crumbs.length - 1 ? 'font-medium text-ink' : 'text-neutral-500'}>{c}</span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3 text-neutral-500">
        <span className="relative">
          <Bell />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
          <User size={15} />
        </span>
      </div>
    </header>
  )
}

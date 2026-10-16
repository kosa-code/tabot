import { Calendar, ChevronDown, ChevronRight, House, Map, PanelLeft, Route, Settings, User, Wallet, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { ICON } from '@/lib/ui'

type NavItemData = { icon: LucideIcon; label: string; active?: boolean }

const SECTIONS: { title: string; items: NavItemData[] }[] = [
  {
    title: 'プラン',
    items: [
      { icon: House, label: 'ダッシュボード' },
      { icon: Route, label: '旅程', active: true },
      { icon: Map, label: '場所' },
      { icon: Calendar, label: 'カレンダー' },
    ],
  },
  {
    title: 'お金',
    items: [
      { icon: Wallet, label: '経費' },
      { icon: User, label: '割り勘' },
    ],
  },
]

function NavItem({ icon: IconComponent, label, active }: NavItemData) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2 text-body',
        active ? 'bg-secondary-light/25 font-medium text-fg-strong' : 'text-fg hover:bg-neutral-50',
      )}
    >
      <IconComponent size={ICON.md} className={active ? 'text-secondary' : 'text-fg-subtle'} />
      {label}
    </a>
  )
}

/** 左の固定ナビゲーション */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-200/70 bg-white lg:flex">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-secondary-dark text-small font-bold text-fg-inverse">t</span>
          <span className="text-title font-semibold text-fg-strong">tabot</span>
          <ChevronDown size={ICON.sm} className="text-fg-subtle" />
        </div>
        <PanelLeft size={ICON.md} className="text-fg-subtle" />
      </div>

      <nav className="flex-1 space-y-5 px-3 py-2">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-2 text-caption font-semibold tracking-wider text-fg-subtle uppercase">{section.title}</div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <NavItem {...item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-neutral-200/70 px-3 py-3">
        <NavItem icon={Settings} label="設定" />
        <div className="flex items-center justify-between rounded-xl px-3 py-2 text-body">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-secondary-light/40 text-secondary-dark">
              <User size={ICON.sm} />
            </span>
            テストユーザー
          </div>
          <ChevronRight size={ICON.sm} className="text-fg-subtle" />
        </div>
      </div>
    </aside>
  )
}

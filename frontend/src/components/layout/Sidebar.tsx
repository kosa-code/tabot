import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type NavItem = { icon: IconName; label: string; active?: boolean }

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'プラン',
    items: [
      { icon: 'home', label: 'ダッシュボード' },
      { icon: 'route', label: '旅程', active: true },
      { icon: 'map', label: '場所' },
      { icon: 'calendar', label: 'カレンダー' },
    ],
  },
  {
    title: 'お金',
    items: [
      { icon: 'wallet', label: '経費' },
      { icon: 'user', label: '割り勘' },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-200/70 bg-white lg:flex">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ink text-[13px] font-bold text-white">t</span>
          <span className="text-[15px] font-semibold">tabot</span>
          <Icon name="chevronDown" size={14} className="text-neutral-400" />
        </div>
        <Icon name="panel" size={16} className="text-neutral-400" />
      </div>

      <nav className="flex-1 space-y-5 px-3 py-2">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">{section.title}</div>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[14px]',
                      item.active ? 'bg-neutral-100 font-medium text-ink' : 'text-neutral-600 hover:bg-neutral-50',
                    )}
                  >
                    <Icon name={item.icon} size={17} className={item.active ? 'text-ink' : 'text-neutral-400'} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-neutral-200/70 px-3 py-3">
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[14px] text-neutral-600 hover:bg-neutral-50">
          <Icon name="settings" size={17} className="text-neutral-400" />
          設定
        </a>
        <div className="flex items-center justify-between rounded-xl px-2.5 py-2 text-[14px]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon name="user" size={14} />
            </span>
            テストユーザー
          </div>
          <Icon name="chevronRight" size={14} className="text-neutral-400" />
        </div>
      </div>
    </aside>
  )
}

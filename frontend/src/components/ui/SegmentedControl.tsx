import { cn } from '@/lib/cn'
import { FOCUS_RING } from '@/lib/ui'

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  /** グループの名前。読み上げに使う */
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

/** 少数の選択肢を切り替えるトグル。押されている状態を aria-pressed で示す */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex gap-6 border-b border-neutral-200 text-body">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            '-mb-px border-b-2 pb-2 transition-colors',
            FOCUS_RING,
            value === o.value ? 'border-secondary-dark text-secondary-dark' : 'border-transparent text-fg-muted hover:text-fg-strong',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

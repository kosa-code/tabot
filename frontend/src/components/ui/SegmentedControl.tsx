import { cn } from '@/lib/cn'

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

/** 少数の選択肢を切り替えるトグル */
export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div role="radiogroup" className="flex rounded-xl bg-neutral-100 p-1 text-small">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-lg px-3 py-1 transition-colors',
            value === o.value ? 'bg-white font-medium text-fg-strong shadow-sm' : 'text-fg-muted hover:text-fg-strong',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

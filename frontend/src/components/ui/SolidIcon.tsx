import type { SVGProps } from 'react'

// バッジ用の塗りつぶしアイコン
const PATHS = {
  pin: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
  museum: 'M12 2 2 7.5V9h20V7.5L12 2zM4 10.5v7h3v-7H4zm6.5 0v7h3v-7h-3zm6.5 0v7h3v-7h-3zM2 19v3h20v-3H2z',
  fork: 'M6 2h2v6h1V2h2v6h1V2h2v8a3 3 0 0 1-2 2.83V22H8V12.83A3 3 0 0 1 6 10V2zm11 0c1.66 0 3 2.24 3 5v8h-2v7h-2v-7h-1.5V7c0-2.76.84-5 2.5-5z',
  train: 'M12 2C7.58 2 5 2.9 5 6v9.5A2.5 2.5 0 0 0 7.5 18L6 19.5V20h2.5l2-2h3l2 2H18v-.5L16.5 18a2.5 2.5 0 0 0 2.5-2.5V6c0-3.1-2.58-4-7-4zM7 6.5h10V11H7V6.5zM8.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  bed: 'M3 5h2v8h6V7h7a3 3 0 0 1 3 3v9h-2v-3H5v3H3V5zm4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  flag: 'M5 2h2v2h11l-2 4 2 4H7v10H5V2z',
  warning: 'M12 2 1 21h22L12 2zm-1 7h2v6h-2V9zm0 8h2v2h-2v-2z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l4.5 2.7 1-1.7-3.5-2.1V7z',
  wallet: 'M3 6a2 2 0 0 1 2-2h12v3H5a1 1 0 0 0 0 2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm13 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
} as const

export type SolidIconName = keyof typeof PATHS

type Props = SVGProps<SVGSVGElement> & { name: SolidIconName; size?: number }

export function SolidIcon({ name, size = 14, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
      <path d={PATHS[name]} />
    </svg>
  )
}

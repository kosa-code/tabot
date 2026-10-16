import type { BadgeTone } from '@/components/ui/Badge'
import type { SolidIconName } from '@/components/ui/SolidIcon'

export type Category = {
  value: string
  label: string
  tone: BadgeTone
  icon: SolidIconName
}

export const CATEGORIES: Category[] = [
  { value: 'sightseeing', label: '観光', tone: 'mint', icon: 'pin' },
  { value: 'museum', label: '美術館・博物館', tone: 'brown', icon: 'museum' },
  { value: 'restaurant', label: '飲食', tone: 'orange', icon: 'fork' },
  { value: 'station', label: '駅・空港', tone: 'neutral', icon: 'train' },
  { value: 'hotel', label: '宿', tone: 'sky', icon: 'bed' },
]

export function findCategory(value: string | null): Category | null {
  if (!value) return null
  return CATEGORIES.find((c) => c.value === value) ?? { value, label: value, tone: 'neutral', icon: 'pin' }
}

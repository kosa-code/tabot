import { BedDouble, Landmark, MapPin, TrainFront, Utensils, type LucideIcon } from 'lucide-react'

export type Category = {
  value: string
  label: string
  icon: LucideIcon
}

// カテゴリは色ではなくアイコンで区別する(docs/ui.md)
export const CATEGORIES = [
  { value: 'sightseeing', label: '観光', icon: MapPin },
  { value: 'museum', label: '美術館・博物館', icon: Landmark },
  { value: 'restaurant', label: '飲食', icon: Utensils },
  { value: 'station', label: '駅・空港', icon: TrainFront },
  { value: 'hotel', label: '宿', icon: BedDouble },
] as const satisfies readonly Category[]

export type CategoryValue = (typeof CATEGORIES)[number]['value']

export function findCategory(value: string | null): Category | null {
  if (!value) return null
  return CATEGORIES.find((c) => c.value === value) ?? { value, label: value, icon: MapPin }
}

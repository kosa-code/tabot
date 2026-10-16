import { BedDouble, Landmark, MapPin, TrainFront, Utensils, type LucideIcon } from 'lucide-react'

import type { BadgeTone } from '@/components/ui/Badge'

export type Category = {
  value: string
  label: string
  tone: BadgeTone
  icon: LucideIcon
}

export const CATEGORIES: Category[] = [
  { value: 'sightseeing', label: '観光', tone: 'mint', icon: MapPin },
  { value: 'museum', label: '美術館・博物館', tone: 'brown', icon: Landmark },
  { value: 'restaurant', label: '飲食', tone: 'orange', icon: Utensils },
  { value: 'station', label: '駅・空港', tone: 'secondary', icon: TrainFront },
  { value: 'hotel', label: '宿', tone: 'sky', icon: BedDouble },
]

export function findCategory(value: string | null): Category | null {
  if (!value) return null
  return CATEGORIES.find((c) => c.value === value) ?? { value, label: value, tone: 'neutral', icon: MapPin }
}

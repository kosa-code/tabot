import raw from '@data/sample.json'

import type { SampleData } from '@/types'

// _comment キーは説明用なので型から外す
const { _comment: _, ...data } = raw as SampleData & { _comment?: string }

export const sampleData: SampleData = data

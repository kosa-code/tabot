import type { TripPlace } from '../types/schemas'
import { formatTime } from '../utils/format'
import Button from './Button'
import Card from './Card'

type Props = {
  item: TripPlace
  onDelete?: () => void
}

function TimelineItem({ item, onDelete }: Props) {
  return (
    <Card>
      <div className="flex gap-4">
        <p className="w-28 shrink-0 text-sm text-gray-500">
          {formatTime(item.start_time)}〜{formatTime(item.end_time)}
        </p>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{item.place_name}</p>
          <p className="text-sm text-gray-500">滞在{item.stay_minutes}分</p>
        </div>
        {onDelete && (
          <div className="shrink-0">
            <Button variant="secondary" onClick={onDelete}>
              削除
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TimelineItem

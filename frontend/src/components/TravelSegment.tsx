type Props = {
  minutes: number
}

function TravelSegment({ minutes }: Props) {
  return (
    <p className="py-2 pl-6 text-sm text-gray-500">↓ 徒歩{minutes}分</p>
  )
}

export default TravelSegment

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function Message({ children }: Props) {
  return <p className="text-sm text-gray-500">{children}</p>
}

export default Message

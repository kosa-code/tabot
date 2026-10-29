type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'datetime-local'
  required?: boolean
}

function Input({ label, value, onChange, type = 'text', required }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
      />
    </label>
  )
}

export default Input

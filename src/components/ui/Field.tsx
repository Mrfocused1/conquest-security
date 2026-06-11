import type { ReactNode } from 'react'

export function FieldLabel({
  children,
  hint,
  htmlFor,
}: {
  children: ReactNode
  hint?: string
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-t2">
      {children}
      {hint && <span className="text-[12px] font-normal text-t3">({hint})</span>}
    </label>
  )
}

export function HelpRow({ help, count, max }: { help?: string; count?: number; max?: number }) {
  return (
    <div className="mt-1.5 flex items-center justify-between">
      <span className="text-[12px] text-t3">{help}</span>
      {typeof count === 'number' && typeof max === 'number' && (
        <span className={`text-[12px] tabular-nums ${count > max ? 'text-danger' : 'text-t3'}`}>
          {count}/{max}
        </span>
      )}
    </div>
  )
}

export function Select({
  value,
  onChange,
  options,
  id,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  id?: string
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field cursor-pointer appearance-none pr-9"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-card text-t1">
            {o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

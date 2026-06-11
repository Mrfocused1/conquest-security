import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { useDirtyGuard } from '../../hooks/useDirtyGuard'

type Props = {
  title: string
  description: string
  dirty: boolean
  busy: boolean
  error: string | null
  onSave: () => void
  children: ReactNode
  headerExtra?: ReactNode
}

/** Standard chrome for a section editor: title, save action, status feedback. */
export function EditorShell({
  title,
  description,
  dirty,
  busy,
  error,
  onSave,
  children,
  headerExtra,
}: Props) {
  useDirtyGuard(dirty)
  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">{title}</h2>
          <p className="mt-1 text-[13.5px] text-t3">{description}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {headerExtra}
          <span
            className={`hidden items-center gap-1.5 text-[12px] sm:flex ${
              error ? 'text-danger' : dirty ? 'text-warn' : 'text-t3'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                error ? 'bg-danger' : dirty ? 'bg-warn' : 'bg-ok'
              }`}
            />
            {error ? 'Save failed' : busy ? 'Saving…' : dirty ? 'Unsaved changes' : 'Saved'}
          </span>
          <button className="btn-white" onClick={onSave} disabled={!dirty || busy}>
            <Icon name="check" size={16} />
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
      {error && (
        <div className="border-b border-danger/20 bg-danger/10 px-6 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { Icon } from '../Icon'
import { FieldLabel } from '../ui/Field'
import { fetchServices, saveServices, type ServiceRow } from '../../lib/cmsApi'

const SERVICE_ICONS: Record<string, string> = {
  shield: 'shield',
  target: 'target',
  lock: 'lock',
  profile: 'profile',
}

export function ServicesEditor() {
  const [rows, setRows] = useState<ServiceRow[]>([])
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices().then((d) => d && setRows(d))
  }, [])

  function update(id: string, patch: Partial<ServiceRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveServices(rows)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDirty(false)
  }

  return (
    <EditorShell
      title="Services"
      description="Edit the four service cards shown on the homepage."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {rows.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/[0.06] bg-surface p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-white">
                <Icon name={SERVICE_ICONS[s.icon ?? ''] ?? 'services'} size={19} />
              </span>
              <input
                className="input-field font-semibold"
                value={s.title}
                aria-label="Service title"
                onChange={(e) => update(s.id, { title: e.target.value })}
              />
            </div>
            <FieldLabel htmlFor={`d-${s.id}`}>Description</FieldLabel>
            <textarea
              id={`d-${s.id}`}
              rows={2}
              className="input-field resize-none"
              value={s.description ?? ''}
              onChange={(e) => update(s.id, { description: e.target.value })}
            />
          </div>
        ))}
      </div>
    </EditorShell>
  )
}

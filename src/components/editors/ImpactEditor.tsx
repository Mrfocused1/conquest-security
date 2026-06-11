import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { FieldLabel } from '../ui/Field'
import { fetchMetrics, saveMetrics, type MetricRow } from '../../lib/cmsApi'

export function ImpactEditor() {
  const [rows, setRows] = useState<MetricRow[]>([])
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics().then((d) => d && setRows(d))
  }, [])

  function update(id: string, patch: Partial<MetricRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveMetrics(rows)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDirty(false)
  }

  return (
    <EditorShell
      title="Impact Metrics"
      description="The headline statistics shown with the count-up animation."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/[0.06] bg-surface p-4">
            <FieldLabel htmlFor={`v-${m.id}`}>Value</FieldLabel>
            <input
              id={`v-${m.id}`}
              className="input-field mb-3 text-[20px] font-bold tracking-[-0.02em]"
              value={m.value}
              onChange={(e) => update(m.id, { value: e.target.value })}
            />
            <FieldLabel htmlFor={`l-${m.id}`}>Label</FieldLabel>
            <input
              id={`l-${m.id}`}
              className="input-field"
              value={m.label}
              onChange={(e) => update(m.id, { label: e.target.value })}
            />
          </div>
        ))}
      </div>
    </EditorShell>
  )
}

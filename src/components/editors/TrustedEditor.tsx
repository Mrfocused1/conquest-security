import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { Icon } from '../Icon'
import { fetchTrustedLogos, saveTrustedLogos, type TrustedLogo } from '../../lib/cmsApi'

export function TrustedEditor() {
  const [rows, setRows] = useState<TrustedLogo[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrustedLogos().then((d) => d && setRows(d))
  }, [])

  function update(id: string, name: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, name } : x)))
    setDirty(true)
  }
  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id))
    if (!id.startsWith('new-')) setDeleted((d) => [...d, id])
    setDirty(true)
  }
  function add() {
    setRows((r) => [...r, { id: `new-${r.length}-${r.map((x) => x.id).join('').length}`, name: '', sort_order: r.length }])
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveTrustedLogos(rows.filter((r) => r.name.trim()), deleted)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDeleted([])
    setDirty(false)
    const fresh = await fetchTrustedLogos()
    if (fresh) setRows(fresh)
  }

  return (
    <EditorShell
      title="Trusted By"
      description="Manage the partner logos shown in the homepage marquee."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2">
            <input
              className="input-field uppercase tracking-wide"
              value={r.name}
              placeholder="PARTNER NAME"
              aria-label="Partner name"
              onChange={(e) => update(r.id, e.target.value)}
            />
            <button
              onClick={() => remove(r.id)}
              aria-label={`Remove ${r.name || 'logo'}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] text-t3 transition-colors duration-150 hover:border-danger/40 hover:text-danger"
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn-ghost mt-4">
        <Icon name="plus" size={15} />
        Add Logo
      </button>
    </EditorShell>
  )
}

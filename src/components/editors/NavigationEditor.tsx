import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { Icon } from '../Icon'
import { fetchNav, saveNav, type NavRow } from '../../lib/cmsApi'

export function NavigationEditor() {
  const [rows, setRows] = useState<NavRow[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNav().then((d) => d && setRows(d))
  }, [])

  function update(id: string, patch: Partial<NavRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    setDirty(true)
  }
  function move(i: number, dir: -1 | 1) {
    setRows((r) => {
      const j = i + dir
      if (j < 0 || j >= r.length) return r
      const next = [...r]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setDirty(true)
  }
  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id))
    if (!id.startsWith('new-')) setDeleted((d) => [...d, id])
    setDirty(true)
  }
  function add() {
    setRows((r) => [...r, { id: `new-${r.length}`, label: '', href: '#', sort_order: r.length }])
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveNav(rows.filter((r) => r.label.trim()), deleted)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDeleted([])
    setDirty(false)
    const fresh = await fetchNav()
    if (fresh) setRows(fresh)
  }

  return (
    <EditorShell
      title="Navigation"
      description="The primary menu items in the site header, in display order."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <div className="flex shrink-0 flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="grid h-5 w-8 place-items-center text-t3 transition-colors hover:text-white disabled:opacity-30"
              >
                <Icon name="chevronDown" size={14} className="rotate-180" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label="Move down"
                className="grid h-5 w-8 place-items-center text-t3 transition-colors hover:text-white disabled:opacity-30"
              >
                <Icon name="chevronDown" size={14} />
              </button>
            </div>
            <input
              className="input-field"
              value={r.label}
              placeholder="Menu label"
              aria-label="Menu label"
              onChange={(e) => update(r.id, { label: e.target.value })}
            />
            <input
              className="input-field w-[140px] shrink-0 font-mono text-[12.5px]"
              value={r.href ?? ''}
              placeholder="#section"
              aria-label="Menu link"
              onChange={(e) => update(r.id, { href: e.target.value })}
            />
            <button
              onClick={() => remove(r.id)}
              aria-label={`Remove ${r.label || 'item'}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] text-t3 transition-colors duration-150 hover:border-danger/40 hover:text-danger"
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn-ghost mt-4">
        <Icon name="plus" size={15} />
        Add Menu Item
      </button>
    </EditorShell>
  )
}

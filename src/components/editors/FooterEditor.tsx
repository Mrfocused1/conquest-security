import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { Icon } from '../Icon'
import { fetchFooterLinks, saveFooterLinks, type FooterLink } from '../../lib/cmsApi'

const COLUMNS = ['Services', 'Company', 'Resources']

export function FooterEditor() {
  const [rows, setRows] = useState<FooterLink[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFooterLinks().then((d) => d && setRows(d))
  }, [])

  function update(id: string, patch: Partial<FooterLink>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    setDirty(true)
  }
  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id))
    if (!id.startsWith('new-')) setDeleted((d) => [...d, id])
    setDirty(true)
  }
  function add(column: string) {
    setRows((r) => [
      ...r,
      {
        id: `new-${column}-${r.length}`,
        column_title: column,
        label: '',
        href: '#',
        sort_order: r.filter((x) => x.column_title === column).length,
      },
    ])
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveFooterLinks(rows.filter((r) => r.label.trim()), deleted)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDeleted([])
    setDirty(false)
    const fresh = await fetchFooterLinks()
    if (fresh) setRows(fresh)
  }

  return (
    <EditorShell
      title="Footer"
      description="Manage the footer link columns shown on every page."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col} className="rounded-2xl border border-white/[0.06] bg-surface p-4">
            <div className="label-xs mb-3">{col}</div>
            <div className="space-y-2.5">
              {rows
                .filter((r) => r.column_title === col)
                .map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <input
                      className="input-field"
                      value={r.label}
                      placeholder="Link label"
                      aria-label={`${col} link label`}
                      onChange={(e) => update(r.id, { label: e.target.value })}
                    />
                    <input
                      className="input-field w-[88px] shrink-0 font-mono text-[12px]"
                      value={r.href ?? ''}
                      placeholder="#"
                      aria-label={`${col} link URL`}
                      onChange={(e) => update(r.id, { href: e.target.value })}
                    />
                    <button
                      onClick={() => remove(r.id)}
                      aria-label={`Remove ${r.label || 'link'}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:text-danger"
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                ))}
            </div>
            <button onClick={() => add(col)} className="btn-ghost mt-3 w-full py-2 text-[13px]">
              <Icon name="plus" size={14} />
              Add Link
            </button>
          </div>
        ))}
      </div>
    </EditorShell>
  )
}

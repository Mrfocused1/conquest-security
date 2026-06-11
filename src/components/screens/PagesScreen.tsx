import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import {
  fetchPages,
  createPage,
  setPageStatus,
  deletePage,
  type PageRow,
} from '../../lib/cmsApi'

export function PagesScreen() {
  const [rows, setRows] = useState<PageRow[]>([])
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const d = await fetchPages()
    if (d) setRows(d)
  }
  useEffect(() => {
    void load()
  }, [])

  async function onCreate() {
    if (!title.trim() || busy) return
    setBusy(true)
    setError(null)
    const res = await createPage(title.trim())
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Could not create page')
    setTitle('')
    void load()
  }

  async function toggleStatus(p: PageRow) {
    const next = p.status === 'published' ? 'draft' : 'published'
    setRows((r) => r.map((x) => (x.id === p.id ? { ...x, status: next } : x)))
    const res = await setPageStatus(p.id, next)
    if (!res.ok) {
      setError(res.error ?? 'Status change failed')
      void load()
    }
  }

  async function onDelete(p: PageRow) {
    if (!window.confirm(`Delete page "${p.title}"? This cannot be undone.`)) return
    setRows((r) => r.filter((x) => x.id !== p.id))
    const res = await deletePage(p.id)
    if (!res.ok) {
      setError(res.error ?? 'Delete failed')
      void load()
    }
  }

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Pages</h2>
          <p className="mt-1 text-[13.5px] text-t3">Standalone pages on your website.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            className="input-field w-[200px]"
            placeholder="New page title…"
            value={title}
            aria-label="New page title"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCreate()}
          />
          <button className="btn-white" onClick={onCreate} disabled={!title.trim() || busy}>
            <Icon name="plus" size={15} />
            Add Page
          </button>
        </div>
      </div>
      {error && (
        <div className="border-b border-danger/20 bg-danger/10 px-6 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="px-6 py-14 text-center text-[14px] text-t3">
          No pages yet — create your first page above.
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {rows.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-white">
                <Icon name="pages" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14.5px] font-medium text-white">{p.title}</div>
                <div className="truncate font-mono text-[12px] text-t3">/{p.slug}</div>
              </div>
              <button
                onClick={() => toggleStatus(p)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors duration-150 ${
                  p.status === 'published' ? 'bg-ok/15 text-ok' : 'bg-warn/15 text-warn'
                }`}
                title="Toggle publish status"
              >
                {p.status === 'published' ? 'Published' : 'Draft'}
              </button>
              <button
                onClick={() => onDelete(p)}
                aria-label={`Delete ${p.title}`}
                className="grid h-9 w-9 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-danger"
              >
                <Icon name="trash" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

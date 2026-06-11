import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import {
  fetchSubmissions,
  setSubmissionStatus,
  deleteSubmission,
  type SubmissionRow,
} from '../../lib/cmsApi'

const STATUS_STYLE: Record<SubmissionRow['status'], string> = {
  new: 'bg-ok/15 text-ok',
  read: 'bg-white/[0.08] text-t2',
  archived: 'bg-warn/15 text-warn',
}

export function FormsScreen() {
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [filter, setFilter] = useState<'all' | SubmissionRow['status']>('all')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const d = await fetchSubmissions()
    if (d) setRows(d)
  }
  useEffect(() => {
    void load()
  }, [])

  async function setStatus(s: SubmissionRow, status: SubmissionRow['status']) {
    setRows((r) => r.map((x) => (x.id === s.id ? { ...x, status } : x)))
    const res = await setSubmissionStatus(s.id, status)
    if (!res.ok) {
      setError(res.error ?? 'Update failed')
      void load()
    }
  }

  async function onDelete(s: SubmissionRow) {
    if (!window.confirm(`Delete submission from ${s.name ?? 'unknown'}?`)) return
    setRows((r) => r.filter((x) => x.id !== s.id))
    const res = await deleteSubmission(s.id)
    if (!res.ok) {
      setError(res.error ?? 'Delete failed')
      void load()
    }
  }

  const visible = filter === 'all' ? rows : rows.filter((r) => r.status === filter)

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Forms</h2>
          <p className="mt-1 text-[13.5px] text-t3">Consultation requests from the live site.</p>
        </div>
        <div className="ml-auto flex gap-1 rounded-xl border border-white/[0.08] p-1">
          {(['all', 'new', 'read', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors duration-150 ${
                filter === f ? 'bg-white/[0.08] text-white' : 'text-t3 hover:text-t2'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="border-b border-danger/20 bg-danger/10 px-6 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="px-6 py-14 text-center text-[14px] text-t3">No submissions here yet.</div>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {visible.map((s) => (
            <li key={s.id} className="px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white">
                  {(s.name ?? '?').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="text-[14.5px] font-medium text-white">
                    {s.name ?? 'Unknown'}
                    {s.company && <span className="text-t3"> · {s.company}</span>}
                  </div>
                  <div className="truncate text-[12.5px] text-t3">{s.email}</div>
                </div>
                <span
                  className={`ml-auto rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[s.status]}`}
                >
                  {s.status}
                </span>
                <span className="hidden text-[12px] text-t3 sm:block">
                  {new Date(s.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {(s.job_title || s.phone || s.company_size || s.service) && (
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-t3">
                  {s.job_title && <span>Role: <span className="text-t2">{s.job_title}</span></span>}
                  {s.phone && <span>Phone: <span className="text-t2">{s.phone}</span></span>}
                  {s.company_size && <span>Size: <span className="text-t2">{s.company_size}</span></span>}
                  {s.service && <span>Service: <span className="text-t2">{s.service}</span></span>}
                </div>
              )}
              {s.message && <p className="mt-2.5 text-[13.5px] leading-relaxed text-t2">{s.message}</p>}
              <div className="mt-3 flex items-center gap-2">
                {s.status !== 'read' && (
                  <button onClick={() => setStatus(s, 'read')} className="btn-ghost px-3 py-1.5 text-[12.5px]">
                    Mark Read
                  </button>
                )}
                {s.status !== 'archived' && (
                  <button onClick={() => setStatus(s, 'archived')} className="btn-ghost px-3 py-1.5 text-[12.5px]">
                    Archive
                  </button>
                )}
                <button
                  onClick={() => onDelete(s)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-t3 transition-colors duration-150 hover:text-danger"
                >
                  <Icon name="trash" size={14} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

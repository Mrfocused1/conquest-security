import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../Icon'
import { fetchAuditLog, type AuditFull } from '../../lib/cmsApi'

const ACTION_STYLE: Record<string, string> = {
  create: 'bg-ok/15 text-ok',
  update: 'bg-white/[0.08] text-t2',
  publish: 'bg-ok/15 text-ok',
  unpublish: 'bg-warn/15 text-warn',
  delete: 'bg-danger/15 text-danger',
  reorder: 'bg-white/[0.08] text-t2',
  upload: 'bg-ok/15 text-ok',
  invite: 'bg-warn/15 text-warn',
}

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function AuditScreen() {
  const [rows, setRows] = useState<AuditFull[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    fetchAuditLog().then((d) => d && setRows(d))
  }, [])

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    if (!t) return rows
    return rows.filter((r) =>
      [r.actor_name, r.action, r.section, r.summary].some((v) => v?.toLowerCase().includes(t)),
    )
  }, [rows, q])

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Audit Log</h2>
          <p className="mt-1 text-[13.5px] text-t3">Every change made through the CMS.</p>
        </div>
        <div className="relative ml-auto">
          <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
          <input
            className="input-field w-[220px] pl-9"
            placeholder="Filter by user, action…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-14 text-center text-[14px] text-t3">No matching activity.</div>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {filtered.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6">
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                  ACTION_STYLE[r.action] ?? 'bg-white/[0.08] text-t2'
                }`}
              >
                {r.action}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] text-white">
                  {r.summary ?? `${r.section ?? 'Site'} ${r.action}`}
                </div>
                <div className="truncate text-[12px] text-t3">
                  {r.actor_name ?? 'Unknown'}
                  {r.section && ` · ${r.section}`}
                </div>
              </div>
              <span className="text-[12px] tabular-nums text-t3">{when(r.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

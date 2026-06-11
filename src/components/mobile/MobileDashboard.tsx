import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { fetchRecentAudit, type AuditRow } from '../../lib/cmsApi'
import { METRICS, QUICK_ACTIONS, RECENT_CHANGES, type NavKey } from '../../data/nav'

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}

type Props = {
  onOpenSection: (key: NavKey) => void
  stats: { sections: number; blocks: number; views: string } | null
}

export function MobileDashboard({ onOpenSection, stats }: Props) {
  const [audit, setAudit] = useState<AuditRow[] | null>(null)

  useEffect(() => {
    fetchRecentAudit(3).then(setAudit)
  }, [])

  const metrics = METRICS.map((m) => {
    if (m.label === 'Sections' && stats) return { ...m, value: String(stats.sections) }
    if (m.label === 'Content Blocks' && stats) return { ...m, value: String(stats.blocks) }
    if (m.label === 'Page Views' && stats) return { ...m, value: stats.views }
    return m
  })

  return (
    <div className="px-4 pb-28 pt-5">
      {/* Welcome */}
      <h1 className="text-[26px] font-bold tracking-[-0.02em] text-white">Welcome back, Admin</h1>
      <p className="mt-1 text-[14px] text-t3">Here's what's happening with your site today.</p>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`card-surface overflow-hidden p-4 ${
              i === metrics.length - 1 && metrics.length % 2 === 1 ? 'col-span-2' : ''
            }`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
              <Icon name={m.icon} size={18} />
            </span>
            <div className="mt-3 text-[24px] font-bold leading-none tracking-[-0.02em] text-white">
              {m.value}
            </div>
            <div className="mt-1 text-[12.5px] text-t2">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="card-surface divide-y divide-white/[0.05] overflow-hidden">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => onOpenSection(a.key)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-white/[0.04]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
                <Icon name={a.icon} size={17} />
              </span>
              <span className="flex-1 text-[14.5px] font-medium text-white">{a.label}</span>
              <Icon name="chevronRight" size={16} className="text-t3" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent changes — live from the audit log */}
      <div className="mt-7">
        <h2 className="mb-3 text-[16px] font-semibold text-white">Recent Changes</h2>
        <div className="card-surface divide-y divide-white/[0.05] overflow-hidden">
          {(audit && audit.length
            ? audit.map((r) => ({
                what: r.summary ?? `${r.section ?? 'Site'} updated`,
                who: r.actor_name ?? 'Unknown',
                when: timeAgo(r.created_at),
              }))
            : RECENT_CHANGES.map((r) => ({ what: r.what, who: r.who, when: r.when }))
          ).map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
                <Icon name="clock" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-white">{r.what}</div>
                <div className="text-[12px] text-t3">
                  {r.who} · {r.when}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <a href="/" target="_blank" rel="noreferrer" className="btn-white mt-7 w-full">
        <Icon name="external" size={16} />
        View Live Site
      </a>
    </div>
  )
}

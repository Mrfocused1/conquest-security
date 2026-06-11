import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import {
  fetchProfiles,
  fetchMyRole,
  inviteUser,
  updateProfile,
  deleteProfile,
  type ProfileRow,
} from '../../lib/cmsApi'

const ROLES: ProfileRow['role'][] = ['admin', 'editor', 'author', 'viewer']

const ROLE_STYLE: Record<ProfileRow['role'], string> = {
  admin: 'bg-white/[0.12] text-white',
  editor: 'bg-ok/15 text-ok',
  author: 'bg-warn/15 text-warn',
  viewer: 'bg-white/[0.06] text-t2',
}
const STATUS_STYLE: Record<ProfileRow['status'], string> = {
  active: 'text-ok',
  invited: 'text-warn',
  suspended: 'text-danger',
}

export function UsersScreen() {
  const [rows, setRows] = useState<ProfileRow[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [inv, setInv] = useState({ name: '', email: '', role: 'editor' as ProfileRow['role'] })

  async function load() {
    const d = await fetchProfiles()
    if (d) setRows(d)
  }
  useEffect(() => {
    void load()
    fetchMyRole().then((r) => setIsAdmin(r === 'admin'))
  }, [])

  async function changeRole(p: ProfileRow, role: ProfileRow['role']) {
    setRows((r) => r.map((x) => (x.id === p.id ? { ...x, role } : x)))
    const res = await updateProfile(p.id, { role })
    if (!res.ok) {
      setError(res.error ?? 'Update failed')
      void load()
    }
  }
  async function toggleSuspend(p: ProfileRow) {
    const status = p.status === 'suspended' ? 'active' : 'suspended'
    setRows((r) => r.map((x) => (x.id === p.id ? { ...x, status } : x)))
    const res = await updateProfile(p.id, { status })
    if (!res.ok) {
      setError(res.error ?? 'Update failed')
      void load()
    }
  }
  async function remove(p: ProfileRow) {
    if (!window.confirm(`Remove ${p.name} (${p.email})?`)) return
    setRows((r) => r.filter((x) => x.id !== p.id))
    const res = await deleteProfile(p.id)
    if (!res.ok) {
      setError(res.error ?? 'Delete failed')
      void load()
    }
  }
  async function submitInvite() {
    if (!inv.name.trim() || !inv.email.trim()) return
    const res = await inviteUser(inv.name.trim(), inv.email.trim(), inv.role)
    if (!res.ok) return setError(res.error ?? 'Invite failed')
    setShowInvite(false)
    setInv({ name: '', email: '', role: 'editor' })
    void load()
  }

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Users</h2>
          <p className="mt-1 text-[13.5px] text-t3">
            Team members and their roles{!isAdmin && ' (admin access required to edit)'}.
          </p>
        </div>
        {isAdmin && (
          <button className="btn-white ml-auto" onClick={() => setShowInvite((s) => !s)}>
            <Icon name="plus" size={15} />
            Invite User
          </button>
        )}
      </div>
      {error && (
        <div className="border-b border-danger/20 bg-danger/10 px-6 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      {showInvite && isAdmin && (
        <div className="flex flex-wrap items-end gap-3 border-b border-white/[0.06] bg-surface px-6 py-4">
          <div>
            <div className="label-xs mb-1.5">Name</div>
            <input
              className="input-field w-[160px]"
              value={inv.name}
              onChange={(e) => setInv({ ...inv, name: e.target.value })}
            />
          </div>
          <div>
            <div className="label-xs mb-1.5">Email</div>
            <input
              className="input-field w-[200px]"
              value={inv.email}
              onChange={(e) => setInv({ ...inv, email: e.target.value })}
            />
          </div>
          <div>
            <div className="label-xs mb-1.5">Role</div>
            <select
              className="input-field"
              value={inv.role}
              onChange={(e) => setInv({ ...inv, role: e.target.value as ProfileRow['role'] })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-card capitalize">
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-white" onClick={submitInvite}>
            Send Invite
          </button>
        </div>
      )}

      <ul className="divide-y divide-white/[0.05]">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white">
              {p.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-medium text-white">{p.name}</div>
              <div className="truncate text-[12.5px] text-t3">{p.email}</div>
            </div>
            <span className={`text-[12px] font-medium capitalize ${STATUS_STYLE[p.status]}`}>
              {p.status}
            </span>
            {isAdmin ? (
              <select
                value={p.role}
                onChange={(e) => changeRole(p, e.target.value as ProfileRow['role'])}
                className={`rounded-md border-0 px-2 py-1 text-[12px] font-semibold capitalize outline-none ${ROLE_STYLE[p.role]}`}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-card text-white">
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`rounded-md px-2 py-0.5 text-[12px] font-semibold capitalize ${ROLE_STYLE[p.role]}`}>
                {p.role}
              </span>
            )}
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleSuspend(p)}
                  className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[12px] font-medium text-t2 transition-colors duration-150 hover:border-white/20 hover:text-white"
                >
                  {p.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
                <button
                  onClick={() => remove(p)}
                  aria-label={`Remove ${p.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-danger"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

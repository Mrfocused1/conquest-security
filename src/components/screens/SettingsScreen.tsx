import { useEffect, useState } from 'react'
import { EditorShell } from '../editors/EditorShell'
import { FieldLabel } from '../ui/Field'
import { fetchSiteSettings, saveSiteSettings, type SiteSettings } from '../../lib/cmsApi'
import { useAuth } from '../../store/auth'

export function SettingsScreen() {
  const { session, signOut } = useAuth()
  const [s, setS] = useState<SiteSettings>({ site_name: '', primary_domain: '' })
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSiteSettings().then((d) => d && setS(d))
  }, [])

  function update(patch: Partial<SiteSettings>) {
    setS((x) => ({ ...x, ...patch }))
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveSiteSettings(s)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDirty(false)
  }

  return (
    <div className="space-y-5">
      <EditorShell
        title="Settings"
        description="Site-wide configuration."
        dirty={dirty}
        busy={busy}
        error={error}
        onSave={save}
      >
        <div className="grid max-w-xl grid-cols-1 gap-4">
          <div>
            <FieldLabel htmlFor="st-name">Site Name</FieldLabel>
            <input
              id="st-name"
              className="input-field"
              value={s.site_name}
              onChange={(e) => update({ site_name: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel htmlFor="st-domain">Primary Domain</FieldLabel>
            <input
              id="st-domain"
              className="input-field font-mono text-[13px]"
              value={s.primary_domain ?? ''}
              placeholder="conquestsecurity.space"
              onChange={(e) => update({ primary_domain: e.target.value })}
            />
            <p className="mt-1.5 text-[12px] text-t3">
              Connected via Vercel — DNS is managed at Hostinger.
            </p>
          </div>
        </div>
      </EditorShell>

      <section className="card-surface fade-in p-5 sm:p-6">
        <h3 className="text-[16px] font-semibold text-white">Account</h3>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[13px] font-semibold text-white">
            AD
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-medium text-white">Admin User</div>
            <div className="truncate text-[12.5px] text-t3">{session?.user.email}</div>
          </div>
          <button
            onClick={signOut}
            className="ml-auto rounded-xl border border-danger/30 px-4 py-2 text-[13.5px] font-medium text-danger transition-colors duration-150 hover:bg-danger/10"
          >
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}

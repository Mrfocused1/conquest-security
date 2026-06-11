import { useEffect, useState } from 'react'
import { EditorShell } from '../editors/EditorShell'
import { FieldLabel } from '../ui/Field'
import { fetchSiteSettings, saveSiteSettings, type SiteSettings } from '../../lib/cmsApi'
import { useAuth } from '../../store/auth'
import { supabase } from '../../lib/supabase'

export function SettingsScreen() {
  const { session, signOut } = useAuth()
  const [s, setS] = useState<SiteSettings>({ site_name: '', primary_domain: '' })
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function changePassword() {
    setPwMsg(null)
    if (pw.length < 8) return setPwMsg({ ok: false, text: 'Password must be at least 8 characters.' })
    if (pw !== pw2) return setPwMsg({ ok: false, text: 'Passwords do not match.' })
    setPwBusy(true)
    const { error: err } = await supabase.auth.updateUser({ password: pw })
    setPwBusy(false)
    if (err) return setPwMsg({ ok: false, text: err.message })
    setPw('')
    setPw2('')
    setPwMsg({ ok: true, text: 'Password updated.' })
  }

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
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[13px] font-semibold uppercase text-white">
            {(session?.user.email ?? '?').slice(0, 2)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-medium text-white">
              {session?.user.email ?? 'Signed in'}
            </div>
            <div className="truncate text-[12.5px] text-t3">Administrator</div>
          </div>
          <button
            onClick={signOut}
            className="ml-auto rounded-xl border border-danger/30 px-4 py-2 text-[13.5px] font-medium text-danger transition-colors duration-150 hover:bg-danger/10"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <h4 className="text-[14px] font-semibold text-white">Change password</h4>
          <div className="mt-3 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pw-new">New password</FieldLabel>
              <input
                id="pw-new"
                type="password"
                autoComplete="new-password"
                className="input-field"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pw-confirm">Confirm password</FieldLabel>
              <input
                id="pw-confirm"
                type="password"
                autoComplete="new-password"
                className="input-field"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
            </div>
          </div>
          {pwMsg && (
            <p className={`mt-2 text-[13px] ${pwMsg.ok ? 'text-ok' : 'text-danger'}`}>{pwMsg.text}</p>
          )}
          <button
            onClick={changePassword}
            disabled={pwBusy || !pw}
            className="btn-white mt-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pwBusy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </section>
    </div>
  )
}

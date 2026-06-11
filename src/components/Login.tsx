import { useState, type FormEvent } from 'react'
import { Mark } from './Icon'
import { useAuth } from '../store/auth'

export function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    const err = await signIn(email.trim(), password)
    if (err) {
      setError(err === 'Invalid login credentials' ? 'Incorrect email or password.' : err)
      setBusy(false)
    }
    // On success the auth listener swaps this screen for the dashboard.
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 62%)' }}
      />

      <div className="fade-in relative w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.08] bg-card text-white shadow-soft">
            <Mark size={26} />
          </span>
          <div className="mt-4 text-[18px] font-bold tracking-wide text-white">CONQUEST</div>
          <div className="mt-1 text-[10px] font-medium tracking-[0.32em] text-t3">SECURITY</div>
          <p className="mt-4 text-[14px] text-t2">Sign in to manage your website</p>
        </div>

        <form onSubmit={onSubmit} className="card-surface p-6">
          <label htmlFor="login-email" className="mb-2 block text-[13px] font-medium text-t2">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            className="input-field mb-4"
            placeholder="you@conquest.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-password" className="mb-2 block text-[13px] font-medium text-t2">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            className="input-field"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p role="alert" className="mt-3 text-[13px] text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-white mt-5 w-full disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[12.5px] text-t3">
          Access is restricted to authorized Conquest Security staff.
        </p>
      </div>
    </div>
  )
}

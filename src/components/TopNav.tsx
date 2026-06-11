import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

type Props = {
  title: string
  subtitle: string
  onSettings?: () => void
  onSignOut?: () => void
  email?: string
}

export function TopNav({ title, subtitle, onSettings, onSignOut, email }: Props) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/[0.06] bg-ink/80 px-8 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-white">{title}</h1>
          <span className="hidden truncate text-[14px] text-t3 lg:block">{subtitle}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="relative hidden xl:block">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
          <input
            placeholder="Search content, pages, media…"
            className="input-field w-[280px] pl-9"
            aria-label="Search"
          />
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost hidden md:inline-flex">
          <Icon name="external" size={16} />
          View Live Site
        </a>

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] py-1.5 pl-1.5 pr-2.5 transition-colors duration-150 hover:border-white/20"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white">
              AD
            </span>
            <Icon
              name="chevronDown"
              size={15}
              className={`text-t3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="fade-in absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-card shadow-lift"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[13px] font-semibold text-white">
                  AD
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-white">Admin User</div>
                  <div className="truncate text-[12px] text-t3">{email ?? 'admin@conquest.com'}</div>
                </div>
              </div>
              <div className="p-1.5">
                <MenuItem
                  icon="profile"
                  label="Your Profile"
                  onClick={() => {
                    setOpen(false)
                    onSettings?.()
                  }}
                />
                <MenuItem
                  icon="settings"
                  label="Account Settings"
                  onClick={() => {
                    setOpen(false)
                    onSettings?.()
                  }}
                />
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-t2 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
                >
                  <Icon name="external" size={17} className="text-t3" />
                  View Live Site
                </a>
              </div>
              <div className="border-t border-white/[0.06] p-1.5">
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpen(false)
                    onSignOut?.()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-danger transition-colors duration-150 hover:bg-danger/10"
                >
                  <Icon name="back" size={17} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-t2 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
    >
      <Icon name={icon} size={17} className="text-t3" />
      {label}
    </button>
  )
}

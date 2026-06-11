import { useState } from 'react'
import { Icon, Mark } from './Icon'
import { NAV, type NavKey } from '../data/nav'

type Props = {
  active: NavKey
  onNavigate: (key: NavKey) => void
}

export function Sidebar({ active, onNavigate }: Props) {
  const [openContent, setOpenContent] = useState(true)
  const contentKeys = NAV.find((n) => n.children)?.children?.map((c) => c.key) ?? []
  const inContent = contentKeys.includes(active)

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-white/[0.06] bg-surface">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] text-white">
          <Mark size={20} />
        </div>
        <div className="leading-none">
          <div className="text-[15px] font-bold tracking-wide text-white">CONQUEST</div>
          <div className="mt-1 text-[9px] font-medium tracking-[0.3em] text-t3">SECURITY</div>
        </div>
      </div>

      <div className="mx-4 border-t border-white/[0.06]" />

      {/* Nav */}
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          if (item.children) {
            return (
              <div key="site-content" className="mt-1">
                <button
                  onClick={() => setOpenContent((o) => !o)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 ${
                    inContent ? 'text-white' : 'text-t2 hover:text-white'
                  }`}
                >
                  <Icon name={item.icon} size={18} className="text-t3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className={`text-t3 transition-transform duration-150 ${openContent ? '' : '-rotate-90'}`}
                  />
                </button>
                {openContent && (
                  <div className="mb-1 ml-[26px] mt-0.5 border-l border-white/[0.06] pl-2">
                    {item.children.map((c) => {
                      const on = active === c.key
                      return (
                        <button
                          key={c.key}
                          onClick={() => onNavigate(c.key)}
                          aria-current={on ? 'page' : undefined}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors duration-150 ${
                            on ? 'bg-white/[0.06] text-white' : 'text-t2 hover:text-white'
                          }`}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          const on = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={on ? 'page' : undefined}
              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 ${
                on ? 'bg-white/[0.06] text-white' : 'text-t2 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Icon name={item.icon} size={18} className={on ? 'text-white' : 'text-t3'} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost mb-3 w-full">
          <Icon name="external" size={16} />
          View Live Site
        </a>
        <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors duration-150 hover:bg-white/[0.03]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white">
            AD
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-white">Admin User</span>
            <span className="block truncate text-[12px] text-t3">admin@conquest.com</span>
          </span>
          <Icon name="chevronDown" size={16} className="text-t3" />
        </button>
      </div>
    </aside>
  )
}

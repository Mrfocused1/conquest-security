import { Icon } from '../Icon'

export type MobileTab = 'dashboard' | 'content' | 'settings' | 'profile'

const TABS: { key: MobileTab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'content', label: 'Content', icon: 'content' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: MobileTab
  onChange: (t: MobileTab) => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
        {TABS.map((t) => {
          const on = active === t.key
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 transition-colors duration-150 ${
                on ? 'text-white' : 'text-t3'
              }`}
            >
              <Icon name={t.icon} size={21} strokeW={on ? 2 : 1.6} />
              <span className="text-[10.5px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

import { Icon, Mark } from '../Icon'

export function MobileTopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-ink/85 px-4 backdrop-blur-xl">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.12] text-white"
      >
        <Icon name="navigation" size={18} />
      </button>
      <div className="flex items-center gap-2">
        <span className="text-white">
          <Mark size={20} />
        </span>
        <div className="leading-none">
          <div className="text-[13px] font-bold tracking-wide text-white">CONQUEST</div>
          <div className="mt-0.5 text-[8px] font-medium tracking-[0.28em] text-t3">SECURITY</div>
        </div>
      </div>
      <button
        className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white"
        aria-label="Account"
      >
        AD
      </button>
    </header>
  )
}

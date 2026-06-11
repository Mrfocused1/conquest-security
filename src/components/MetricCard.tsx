import { Icon } from './Icon'

type Props = {
  value: string
  label: string
  sub: string
  icon: string
}

export function MetricCard({ value, label, sub, icon }: Props) {
  return (
    <div className="card-surface hover-lift overflow-hidden p-5 lg:p-6">
      <div className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white">
          <Icon name={icon} size={20} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[24px] font-bold leading-none tracking-[-0.02em] text-white">
            {value}
          </div>
          <div className="mt-1.5 truncate text-[13.5px] font-medium text-t2">{label}</div>
        </div>
      </div>
      <div className="mt-4 truncate text-[12.5px] text-t3">{sub}</div>
    </div>
  )
}

import { useCms } from '../store/cms'
import { LOGO_URL } from '../lib/assets'

/** Real-time homepage hero preview that mirrors the editor state. */
export function LivePreview({ compact = false }: { compact?: boolean }) {
  const { content, design } = useCms()
  const lines = content.heading.split('\n')
  const logoLeft = design.logoPosition === 'Left'
  const logoCenter = design.logoPosition === 'Center'

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.06]"
      style={{
        background:
          'radial-gradient(120% 90% at 80% 0%, #15181d 0%, #0a0c10 55%, #050608 100%)',
      }}
    >
      {/* ambient glow */}
      {design.glow && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-30%',
            [logoLeft ? 'left' : 'right']: '6%',
            width: '55%',
            height: '120%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.16), transparent 62%)',
          }}
        />
      )}

      <div
        className={`relative flex items-center gap-4 ${
          logoLeft ? 'flex-row-reverse' : 'flex-row'
        } ${logoCenter ? 'flex-col text-center' : ''}`}
        style={{ padding: compact ? '24px' : '34px 38px' }}
      >
        <div className={logoCenter ? 'w-full' : 'flex-1'}>
          <h3
            className="font-semibold leading-[1.06] tracking-[-0.02em] text-white"
            style={{ fontSize: compact ? 22 : 26 }}
          >
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l || ' '}
              </span>
            ))}
          </h3>
          <p
            className="mt-3 leading-[1.6] text-t2"
            style={{ fontSize: compact ? 12.5 : 13, maxWidth: logoCenter ? '100%' : 340 }}
          >
            {content.description}
          </p>
          <div className={`mt-5 flex flex-wrap gap-2.5 ${logoCenter ? 'justify-center' : ''}`}>
            <span className="rounded-lg bg-white px-3.5 py-2 text-[12px] font-semibold text-ink">
              {content.primaryText || 'Primary'}
            </span>
            <span className="rounded-lg border border-white/20 px-3.5 py-2 text-[12px] font-medium text-white">
              {content.secondaryText || 'Secondary'}
            </span>
          </div>
        </div>

        {!logoCenter && (
          <div className="flex flex-1 items-center justify-center">
            <img
              src={design.logoUrl || LOGO_URL}
              alt={design.logoAlt}
              className="select-none object-contain"
              style={{
                width: `${Math.max(40, Math.min(100, (design.logoSize / 420) * 92))}%`,
                filter: 'drop-shadow(0 14px 34px rgba(0,0,0,0.6))',
              }}
              draggable={false}
            />
          </div>
        )}
        {logoCenter && (
          <img
            src={LOGO_URL}
            alt={design.logoAlt}
            className="mt-5 select-none object-contain"
            style={{ width: `${Math.max(28, Math.min(60, (design.logoSize / 420) * 50))}%` }}
            draggable={false}
          />
        )}
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import { Icon } from './Icon'
import { FieldLabel, Select } from './ui/Field'
import { useCms } from '../store/cms'
import { LOGO_URL } from '../lib/assets'
import { uploadMedia, saveHeroLogo } from '../lib/cmsApi'

export function SettingsPanel() {
  const { design, setDesign } = useCms()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPick(files: FileList | null) {
    if (!files || !files[0]) return
    setBusy(true)
    setError(null)
    const res = await uploadMedia(files[0], 'logo')
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    if (!res.ok || !res.url) return setError(res.error ?? 'Upload failed')
    setDesign({ logoUrl: res.url })
    void saveHeroLogo(res.url) // reflect on the live site immediately
  }

  function removeLogo() {
    setDesign({ logoUrl: '' })
    void saveHeroLogo('')
  }

  const current = design.logoUrl || LOGO_URL

  return (
    <div className="flex flex-col gap-5">
      <section className="card-surface fade-in p-5">
        <div className="mb-1 text-[15px] font-semibold text-white">Edit Component</div>
        <div className="mb-4 text-[13px] text-t3">Hero Visual (Logo)</div>

        <FieldLabel>Logo</FieldLabel>
        <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-surface py-7">
          <img src={current} alt="Current logo" className="h-24 w-auto object-contain" />
        </div>
        {error && <p className="mt-2 text-[12px] text-danger">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button className="btn-ghost flex-1" onClick={() => fileRef.current?.click()} disabled={busy}>
            <Icon name="upload" size={15} />
            {busy ? 'Uploading…' : 'Change Logo'}
          </button>
          <button
            onClick={removeLogo}
            disabled={!design.logoUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 px-3 py-2.5 text-[14px] font-medium text-danger transition-colors duration-150 hover:bg-danger/10 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />

        <div className="mt-5">
          <FieldLabel htmlFor="logoSize">Logo Size</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              id="logoSize"
              type="range"
              min={120}
              max={600}
              step={10}
              value={design.logoSize}
              onChange={(e) => setDesign({ logoSize: Number(e.target.value) })}
              className="slider flex-1"
            />
            <div className="w-[68px] shrink-0 rounded-lg border border-white/[0.08] bg-surface px-2 py-1.5 text-center text-[13px] tabular-nums text-t1">
              {design.logoSize}px
            </div>
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel htmlFor="logoPos">Logo Position</FieldLabel>
          <Select
            id="logoPos"
            value={design.logoPosition}
            onChange={(v) => setDesign({ logoPosition: v as typeof design.logoPosition })}
            options={['Left', 'Center', 'Right']}
          />
        </div>
      </section>
    </div>
  )
}

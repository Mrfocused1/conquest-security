import { useEffect, useState } from 'react'
import { EditorShell } from './EditorShell'
import { FieldLabel } from '../ui/Field'
import { fetchSectionContent, saveSectionContent } from '../../lib/cmsApi'

type Cta = { heading: string; subtext: string; button_text: string; button_link: string }

const EMPTY: Cta = { heading: '', subtext: '', button_text: '', button_link: '' }

export function CtaEditor() {
  const [cta, setCta] = useState<Cta>(EMPTY)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSectionContent('cta').then((c) => {
      if (c) setCta({ ...EMPTY, ...c })
    })
  }, [])

  function update(patch: Partial<Cta>) {
    setCta((c) => ({ ...c, ...patch }))
    setDirty(true)
  }
  async function save() {
    setBusy(true)
    setError(null)
    const res = await saveSectionContent('cta', 'CTA Banner', { ...cta })
    setBusy(false)
    if (!res.ok) return setError(res.error ?? 'Save failed')
    setDirty(false)
  }

  return (
    <EditorShell
      title="CTA Banner"
      description="The closing call-to-action banner above the footer."
      dirty={dirty}
      busy={busy}
      error={error}
      onSave={save}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="cta-h">Heading</FieldLabel>
            <input
              id="cta-h"
              className="input-field"
              value={cta.heading}
              onChange={(e) => update({ heading: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel htmlFor="cta-s">Subtext</FieldLabel>
            <input
              id="cta-s"
              className="input-field"
              value={cta.subtext}
              onChange={(e) => update({ subtext: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="cta-bt">Button Text</FieldLabel>
              <input
                id="cta-bt"
                className="input-field"
                value={cta.button_text}
                onChange={(e) => update({ button_text: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor="cta-bl">Button Link</FieldLabel>
              <input
                id="cta-bl"
                className="input-field"
                value={cta.button_link}
                onChange={(e) => update({ button_link: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* live mini preview */}
        <div>
          <div className="mb-2 text-[13px] font-medium text-t2">Live Preview</div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#111418] p-6">
            <div className="text-[20px] font-semibold leading-tight tracking-[-0.5px] text-white">
              {cta.heading || 'Ready to strengthen your security?'}
            </div>
            <div className="mt-2 text-[13.5px] text-t2">
              {cta.subtext || "Let's build a safer future together."}
            </div>
            <span className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-[12.5px] font-semibold text-ink">
              {cta.button_text || 'Book a Consultation'}
            </span>
          </div>
        </div>
      </div>
    </EditorShell>
  )
}

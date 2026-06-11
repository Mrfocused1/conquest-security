import { useState } from 'react'
import { Icon } from '../Icon'
import { LivePreview } from '../LivePreview'
import { FieldLabel, HelpRow, Select } from '../ui/Field'
import { Toggle } from '../ui/Toggle'
import { useCms } from '../../store/cms'
import { useDirtyGuard } from '../../hooks/useDirtyGuard'
import { LOGO_URL } from '../../lib/assets'

type Tab = 'content' | 'design' | 'settings'

export function MobileEditor({ title, onBack }: { title: string; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('content')
  const { content, setContent, design, setDesign, seo, setSeo, dirty, saveError, markSaved } = useCms()
  useDirtyGuard(dirty)

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="sticky top-16 z-20 flex items-center gap-2 border-b border-white/[0.06] bg-ink/90 px-3 py-3 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.1] text-white"
          aria-label="Back"
        >
          <Icon name="back" size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-white">{title}</div>
          <div
            className={`flex items-center gap-1.5 text-[11.5px] ${saveError ? 'text-danger' : 'text-t3'}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                saveError ? 'bg-danger' : dirty ? 'bg-warn' : 'bg-ok'
              }`}
            />
            {saveError ? 'Save failed' : dirty ? 'Editing…' : 'Saved'}
          </div>
        </div>
        <button className="btn-white px-4 py-2" onClick={markSaved}>
          Save
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[124px] z-10 flex gap-1 border-b border-white/[0.06] bg-ink px-3 py-2">
        {(['content', 'design', 'settings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-[13.5px] font-medium capitalize transition-colors duration-150 ${
              tab === t ? 'bg-white/[0.07] text-white' : 'text-t3'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5 px-4 py-5">
        {tab === 'content' && (
          <>
            <div>
              <div className="mb-2 text-[12px] font-medium text-t2">Live Preview</div>
              <LivePreview compact />
            </div>
            <div>
              <FieldLabel htmlFor="m-top">Top Label</FieldLabel>
              <input
                id="m-top"
                className="input-field"
                value={content.topLabel}
                onChange={(e) => setContent({ topLabel: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor="m-head">Headline</FieldLabel>
              <textarea
                id="m-head"
                rows={2}
                className="input-field resize-none"
                value={content.heading}
                onChange={(e) => setContent({ heading: e.target.value })}
              />
              <HelpRow count={content.heading.length} max={100} />
            </div>
            <div>
              <FieldLabel htmlFor="m-desc">Description</FieldLabel>
              <textarea
                id="m-desc"
                rows={4}
                className="input-field resize-none"
                value={content.description}
                onChange={(e) => setContent({ description: e.target.value })}
              />
              <HelpRow count={content.description.length} max={200} />
            </div>
            <div>
              <FieldLabel htmlFor="m-pt">Primary Button Text</FieldLabel>
              <input
                id="m-pt"
                className="input-field"
                value={content.primaryText}
                onChange={(e) => setContent({ primaryText: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor="m-st">Secondary Button Text</FieldLabel>
              <input
                id="m-st"
                className="input-field"
                value={content.secondaryText}
                onChange={(e) => setContent({ secondaryText: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="m-pl">Primary Link</FieldLabel>
                <input
                  id="m-pl"
                  className="input-field"
                  value={content.primaryLink}
                  onChange={(e) => setContent({ primaryLink: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel htmlFor="m-sl">Secondary Link</FieldLabel>
                <input
                  id="m-sl"
                  className="input-field"
                  value={content.secondaryLink}
                  onChange={(e) => setContent({ secondaryLink: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {tab === 'design' && (
          <>
            <div>
              <FieldLabel>Logo</FieldLabel>
              <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-surface py-7">
                <img src={LOGO_URL} alt="Logo" className="h-20 w-auto object-contain" />
              </div>
              <button className="btn-ghost mt-3 w-full">
                <Icon name="upload" size={15} />
                Upload New Logo
              </button>
            </div>
            <div className="card-surface divide-y divide-white/[0.05]">
              <Row label="Enable Animation">
                <Toggle
                  checked={design.animation}
                  onChange={(v) => setDesign({ animation: v })}
                  label="Enable animation"
                />
              </Row>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <FieldLabel>Logo Size</FieldLabel>
                <span className="text-[12px] tabular-nums text-t2">{design.logoSize}px</span>
              </div>
              <input
                type="range"
                min={120}
                max={600}
                step={10}
                value={design.logoSize}
                onChange={(e) => setDesign({ logoSize: Number(e.target.value) })}
                className="slider w-full"
              />
            </div>
            <div>
              <FieldLabel>Logo Alignment</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {(['Left', 'Center', 'Right'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDesign({ logoPosition: p })}
                    className={`rounded-xl border py-2.5 text-[13px] font-medium transition-colors duration-150 ${
                      design.logoPosition === p
                        ? 'border-white/25 bg-white/[0.06] text-white'
                        : 'border-white/[0.08] text-t3'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <div>
              <div className="mb-2 text-[14px] font-semibold text-white">SEO Settings</div>
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="m-mt">Meta Title</FieldLabel>
                  <input
                    id="m-mt"
                    className="input-field"
                    value={seo.metaTitle}
                    onChange={(e) => setSeo({ metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="m-md">Meta Description</FieldLabel>
                  <textarea
                    id="m-md"
                    rows={3}
                    className="input-field resize-none"
                    value={seo.metaDescription}
                    onChange={(e) => setSeo({ metaDescription: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="m-alt">Alt Text</FieldLabel>
                  <input
                    id="m-alt"
                    className="input-field"
                    value={seo.altText}
                    onChange={(e) => setSeo({ altText: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[14px] text-t2">{label}</span>
      {children}
    </div>
  )
}

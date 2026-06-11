import { Icon } from './Icon'
import { LivePreview } from './LivePreview'
import { FieldLabel, HelpRow } from './ui/Field'
import { useCms } from '../store/cms'
import { useDirtyGuard } from '../hooks/useDirtyGuard'

export function ContentEditor() {
  const { content, setContent, dirty, saveError, markSaved, reset } = useCms()
  useDirtyGuard(dirty)

  return (
    <section className="card-surface fade-in overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-6 py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Hero Section</h2>
            <span className="rounded-md bg-ok/15 px-2 py-0.5 text-[11px] font-semibold text-ok">
              Published
            </span>
          </div>
          <p className="mt-1 text-[13.5px] text-t3">
            Edit the hero section content that appears at the top of your homepage.
          </p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost ml-auto">
          <Icon name="eye" size={16} />
          Preview Section
        </a>
      </div>

      {/* Body: form | preview+settings */}
      <div className="grid grid-cols-1 gap-7 p-6 xl:grid-cols-2">
        {/* Form */}
        <div>
          <div className="mb-4">
            <FieldLabel hint="Optional" htmlFor="topLabel">
              Top Label
            </FieldLabel>
            <input
              id="topLabel"
              className="input-field"
              value={content.topLabel}
              onChange={(e) => setContent({ topLabel: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="heading">Main Heading</FieldLabel>
            <textarea
              id="heading"
              rows={2}
              className="input-field resize-none"
              value={content.heading}
              onChange={(e) => setContent({ heading: e.target.value })}
            />
            <HelpRow
              help="A powerful headline to grab attention."
              count={content.heading.length}
              max={100}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="desc">Description</FieldLabel>
            <textarea
              id="desc"
              rows={3}
              className="input-field resize-none"
              value={content.description}
              onChange={(e) => setContent({ description: e.target.value })}
            />
            <HelpRow
              help="Describe your value proposition."
              count={content.description.length}
              max={200}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pText">Primary Button</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-t3">Text</span>
                <input
                  id="pText"
                  className="input-field"
                  value={content.primaryText}
                  onChange={(e) => setContent({ primaryText: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="pLink">Link</FieldLabel>
              <input
                id="pLink"
                className="input-field"
                value={content.primaryLink}
                onChange={(e) => setContent({ primaryLink: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="sText">Secondary Button</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-t3">Text</span>
                <input
                  id="sText"
                  className="input-field"
                  value={content.secondaryText}
                  onChange={(e) => setContent({ secondaryText: e.target.value })}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="sLink">Link</FieldLabel>
              <input
                id="sLink"
                className="input-field"
                value={content.secondaryLink}
                onChange={(e) => setContent({ secondaryLink: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-white" onClick={markSaved} disabled={!dirty}>
              <Icon name="check" size={16} />
              Save Changes
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-t2 transition-colors duration-150 hover:text-white"
            >
              <Icon name="reset" size={15} />
              Reset
            </button>
            <span
              className={`ml-auto flex items-center gap-1.5 text-[12px] transition-opacity duration-150 ${
                saveError ? 'text-danger' : dirty ? 'text-warn opacity-100' : 'text-t3 opacity-70'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  saveError ? 'bg-danger' : dirty ? 'bg-warn' : 'bg-ok'
                }`}
              />
              {saveError ? 'Save failed — please retry' : dirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div className="mb-2 text-[13px] font-medium text-t2">Live Preview</div>
          <LivePreview />
        </div>
      </div>
    </section>
  )
}

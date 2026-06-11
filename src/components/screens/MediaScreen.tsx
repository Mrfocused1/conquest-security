import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { fetchMedia, uploadMedia, deleteMedia, type MediaRow } from '../../lib/cmsApi'

function fmtSize(b: number | null): string {
  if (!b) return ''
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

export function MediaScreen() {
  const [rows, setRows] = useState<MediaRow[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const d = await fetchMedia()
    if (d) setRows(d)
  }
  useEffect(() => {
    void load()
  }, [])

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError(null)
    for (const file of Array.from(files)) {
      const res = await uploadMedia(file)
      if (!res.ok) {
        setError(res.error ?? 'Upload failed')
        break
      }
    }
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    void load()
  }

  async function onDelete(row: MediaRow) {
    if (!window.confirm(`Delete "${row.name}"?`)) return
    setRows((r) => r.filter((x) => x.id !== row.id))
    const res = await deleteMedia(row)
    if (!res.ok) {
      setError(res.error ?? 'Delete failed')
      void load()
    }
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(url)
      window.setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">Media Library</h2>
          <p className="mt-1 text-[13.5px] text-t3">Upload and manage images, logos and icons.</p>
        </div>
        <button
          className="btn-white ml-auto"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          <Icon name="upload" size={15} />
          {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>
      {error && (
        <div className="border-b border-danger/20 bg-danger/10 px-6 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-white">
            <Icon name="media" size={24} />
          </span>
          <p className="text-[14px] text-t3">No media yet — upload your first asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 sm:p-6 lg:grid-cols-4">
          {rows.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-xl border border-white/[0.06] bg-surface">
              <div className="grid aspect-[4/3] place-items-center bg-[#0a0c10] p-4">
                <img src={m.url} alt={m.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex items-center gap-1 border-t border-white/[0.06] px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-white">{m.name}</div>
                  <div className="text-[11px] text-t3">{fmtSize(m.size_bytes)}</div>
                </div>
                <button
                  onClick={() => copy(m.url)}
                  aria-label="Copy URL"
                  className="grid h-8 w-8 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
                >
                  <Icon name={copied === m.url ? 'check' : 'copy'} size={15} />
                </button>
                <button
                  onClick={() => onDelete(m)}
                  aria-label="Delete"
                  className="grid h-8 w-8 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-danger"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

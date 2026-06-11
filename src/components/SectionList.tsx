import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { SECTIONS } from '../data/nav'
import {
  fetchSections,
  saveSectionOrder,
  saveSectionStatus,
  type SectionRow,
} from '../lib/cmsApi'

const FALLBACK: SectionRow[] = SECTIONS.map((s) => ({
  key: s.key,
  name: s.name,
  icon: s.icon,
  status: s.status as 'Published' | 'Draft',
  updated: s.updated,
}))

export function SectionList({ onEdit }: { onEdit?: (key: string) => void }) {
  const [rows, setRows] = useState<SectionRow[]>(FALLBACK)
  const dragIndex = useRef<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchSections()
      .then((d) => {
        if (d && d.length) setRows(d)
      })
      .catch(() => {})
  }, [])

  function handleDrop(target: number) {
    const from = dragIndex.current
    if (from === null || from === target) return
    setRows((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(target, 0, moved)
      void saveSectionOrder(next.map((r) => r.key)) // persist new homepage order
      return next
    })
    dragIndex.current = null
    setOverIndex(null)
  }

  function toggleStatus(row: SectionRow) {
    const publish = row.status !== 'Published'
    setRows((prev) =>
      prev.map((r) =>
        r.key === row.key ? { ...r, status: publish ? 'Published' : 'Draft' } : r,
      ),
    )
    void saveSectionStatus(row.key, publish)
  }

  return (
    <section className="card-surface fade-in overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-6 py-5">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-white">All Sections</h2>
          <p className="mt-1 text-[13.5px] text-t3">
            Drag and reorder sections to change their order on the homepage.
          </p>
        </div>
        <button className="btn-white ml-auto">
          <Icon name="plus" size={16} />
          Add New Section
        </button>
      </div>

      <ul className="divide-y divide-white/[0.05]">
        {rows.map((row, i) => (
          <li
            key={row.key}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => {
              e.preventDefault()
              setOverIndex(i)
            }}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => setOverIndex(null)}
            className={`flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 ${
              overIndex === i ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
            }`}
          >
            <button
              className="cursor-grab text-t3 transition-colors hover:text-t2 active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <Icon name="grip" size={18} strokeW={2} />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
              <Icon name={row.icon} size={17} />
            </span>
            <span className="text-[14.5px] font-medium text-white">{row.name}</span>
            <button
              onClick={() => toggleStatus(row)}
              title="Toggle publish status"
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors duration-150 ${
                row.status === 'Published'
                  ? 'bg-ok/15 text-ok hover:bg-ok/25'
                  : 'bg-warn/15 text-warn hover:bg-warn/25'
              }`}
            >
              {row.status}
            </button>

            <span className="ml-auto hidden text-[13px] text-t3 sm:block">
              Last updated: {row.updated}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit?.(row.key)}
                className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[13px] font-medium text-t2 transition-colors duration-150 hover:border-white/20 hover:text-white"
              >
                Edit
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
                aria-label="Duplicate"
              >
                <Icon name="copy" size={16} />
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg text-t3 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
                aria-label="More actions"
              >
                <Icon name="dots" size={18} strokeW={2} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

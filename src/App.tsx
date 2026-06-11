import { useEffect, useState, type ReactNode } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopNav } from './components/TopNav'
import { MetricCard } from './components/MetricCard'
import { ContentEditor } from './components/ContentEditor'
import { SettingsPanel } from './components/SettingsPanel'
import { SectionList } from './components/SectionList'
import { TrustedEditor } from './components/editors/TrustedEditor'
import { ServicesEditor } from './components/editors/ServicesEditor'
import { ImpactEditor } from './components/editors/ImpactEditor'
import { CtaEditor } from './components/editors/CtaEditor'
import { FooterEditor } from './components/editors/FooterEditor'
import { NavigationEditor } from './components/editors/NavigationEditor'
import { PagesScreen } from './components/screens/PagesScreen'
import { MediaScreen } from './components/screens/MediaScreen'
import { FormsScreen } from './components/screens/FormsScreen'
import { UsersScreen } from './components/screens/UsersScreen'
import { AuditScreen } from './components/screens/AuditScreen'
import { SettingsScreen } from './components/screens/SettingsScreen'
import { MobileTopBar } from './components/mobile/MobileTopBar'
import { MobileDashboard } from './components/mobile/MobileDashboard'
import { MobileEditor } from './components/mobile/MobileEditor'
import { BottomNav, type MobileTab } from './components/mobile/BottomNav'
import { Login } from './components/Login'
import { Icon, Mark } from './components/Icon'
import { useAuth } from './store/auth'
import { fetchSections, fetchDashboardStats, type SectionRow } from './lib/cmsApi'
import { anyDirty, confirmDiscard } from './lib/guard'
import { NAV, SECTIONS, METRICS, type NavKey } from './data/nav'

const TITLES: Record<string, { t: string; s: string }> = {
  dashboard: { t: 'Dashboard', s: 'Manage and customize your website content' },
  hero: { t: 'Dashboard', s: 'Manage and customize your website content' },
}

function labelFor(key: NavKey): string {
  for (const item of NAV) {
    if (item.key === key && !item.children) return item.label
    const child = item.children?.find((c) => c.key === key)
    if (child) return child.label
  }
  return 'Section'
}

/** Functional editor/screen for every non-dashboard nav key. */
function renderSection(key: NavKey): ReactNode {
  switch (key) {
    case 'trusted':
      return <TrustedEditor />
    case 'services':
      return <ServicesEditor />
    case 'impact':
      return <ImpactEditor />
    case 'cta':
      return <CtaEditor />
    case 'footer':
      return <FooterEditor />
    case 'navigation':
      return <NavigationEditor />
    case 'pages':
      return <PagesScreen />
    case 'media':
      return <MediaScreen />
    case 'forms':
      return <FormsScreen />
    case 'users':
      return <UsersScreen />
    case 'audit':
      return <AuditScreen />
    case 'settings':
      return <SettingsScreen />
    default:
      return null
  }
}

const DASHBOARD_VIEWS: NavKey[] = ['dashboard', 'hero']

export default function App() {
  const { session, loading, signOut } = useAuth()
  const [active, setActive] = useState<NavKey>('dashboard')
  const [stats, setStats] = useState<{ sections: number; blocks: number; views: string } | null>(null)

  // mobile state
  const [tab, setTab] = useState<MobileTab>('dashboard')
  const [editor, setEditor] = useState<{ open: boolean; key: NavKey }>({ open: false, key: 'hero' })
  const [drawer, setDrawer] = useState(false)

  const isDashboard = DASHBOARD_VIEWS.includes(active)
  const meta = TITLES[active] ?? { t: labelFor(active), s: 'Manage this part of your website' }

  useEffect(() => {
    if (session) fetchDashboardStats().then((s) => s && setStats(s))
  }, [session])

  // Warn before closing/reloading the tab with unsaved edits.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (anyDirty()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  // Guarded navigation — confirm before discarding unsaved changes.
  function navTo(key: NavKey) {
    if (confirmDiscard()) setActive(key)
  }
  function openEditor(key: NavKey) {
    if (!confirmDiscard()) return
    setEditor({ open: true, key })
    window.scrollTo({ top: 0 })
  }
  function closeEditor() {
    if (confirmDiscard()) setEditor({ open: false, key: 'hero' })
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <span className="animate-pulse text-white/60">
          <Mark size={34} />
        </span>
      </div>
    )
  }

  if (!session) return <Login />

  const liveMetrics = METRICS.map((m) => {
    if (m.label === 'Sections' && stats) return { ...m, value: String(stats.sections) }
    if (m.label === 'Content Blocks' && stats) return { ...m, value: String(stats.blocks) }
    if (m.label === 'Page Views' && stats) return { ...m, value: stats.views }
    return m
  })

  return (
    <div className="min-h-screen bg-ink">
      {/* ===================== DESKTOP ===================== */}
      <div className="hidden h-screen lg:flex">
        <Sidebar active={active} onNavigate={navTo} />
        <main className="thin-scroll h-screen flex-1 overflow-y-auto">
          <TopNav
            title={meta.t}
            subtitle={meta.s}
            onSettings={() => navTo('settings')}
            onSignOut={signOut}
            email={session.user.email ?? 'admin@conquest.com'}
          />
          <div className="p-8">
            {isDashboard ? (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="min-w-0 space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {liveMetrics.map((m) => (
                      <MetricCard key={m.label} {...m} />
                    ))}
                  </div>
                  <ContentEditor />
                  <SectionList onEdit={(key) => navTo(key as NavKey)} />
                </div>
                <div className="min-w-0">
                  <SettingsPanel />
                </div>
              </div>
            ) : (
              renderSection(active)
            )}
          </div>
        </main>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="min-h-screen lg:hidden">
        <MobileTopBar onMenu={() => setDrawer(true)} />

        {editor.open ? (
          editor.key === 'hero' ? (
            <MobileEditor title={labelFor('hero')} onBack={closeEditor} />
          ) : (
            <div className="pb-28">
              <div className="sticky top-16 z-20 flex items-center gap-2 border-b border-white/[0.06] bg-ink/90 px-3 py-3 backdrop-blur-xl">
                <button
                  onClick={closeEditor}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.1] text-white"
                  aria-label="Back"
                >
                  <Icon name="back" size={18} />
                </button>
                <div className="truncate text-[15px] font-semibold text-white">
                  {labelFor(editor.key)}
                </div>
              </div>
              <div className="px-4 py-5">{renderSection(editor.key)}</div>
            </div>
          )
        ) : tab === 'dashboard' ? (
          <MobileDashboard onOpenSection={openEditor} stats={stats} />
        ) : tab === 'content' ? (
          <MobileContentList onOpen={openEditor} />
        ) : tab === 'profile' ? (
          <div className="px-4 py-6 pb-28">
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-white">Profile</h1>
            <div className="card-surface mt-5 flex items-center gap-3 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-[14px] font-semibold text-white">
                AD
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-white">Admin User</div>
                <div className="truncate text-[13px] text-t3">{session.user.email}</div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-3 py-3 text-[14px] font-semibold text-danger transition-colors duration-150 active:bg-danger/10"
            >
              <Icon name="back" size={16} />
              Sign out
            </button>
          </div>
        ) : (
          <div className="px-4 py-5 pb-28">
            <SettingsScreen />
          </div>
        )}

        <BottomNav
          active={tab}
          onChange={(t) => {
            if (!confirmDiscard()) return
            setEditor({ open: false, key: 'hero' })
            setTab(t)
          }}
        />

        {/* Drawer */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-200 ${
            drawer ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div
            className={`absolute left-0 top-0 h-full w-[290px] border-r border-white/[0.06] bg-surface transition-transform duration-300 ${
              drawer ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <div className="flex items-center gap-2 text-white">
                <Mark size={20} />
                <span className="text-[14px] font-bold tracking-wide">CONQUEST</span>
              </div>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-t2"
              >
                <Icon name="plus" size={20} className="rotate-45" />
              </button>
            </div>
            <div className="thin-scroll h-[calc(100%-4rem)] overflow-y-auto px-3 py-3">
              {NAV.map((item) =>
                item.children ? (
                  <div key="content" className="mt-2">
                    <div className="label-xs px-3 py-2">{item.label}</div>
                    {item.children.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => {
                          setDrawer(false)
                          setTab('content')
                          openEditor(c.key)
                        }}
                        className="block w-full rounded-lg px-3 py-2.5 text-left text-[14px] text-t2 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (!confirmDiscard()) return
                      setDrawer(false)
                      setEditor({ open: false, key: 'hero' })
                      if (item.key === 'dashboard') setTab('dashboard')
                      else if (item.key === 'settings') setTab('settings')
                      else {
                        setTab('content')
                        openEditor(item.key)
                      }
                    }}
                    className="mt-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-t2 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    <Icon name={item.icon} size={18} className="text-t3" />
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileContentList({ onOpen }: { onOpen: (key: NavKey) => void }) {
  const [rows, setRows] = useState<SectionRow[]>(
    SECTIONS.map((s) => ({ ...s, status: s.status as 'Published' | 'Draft' })),
  )

  useEffect(() => {
    fetchSections().then((d) => {
      if (d && d.length) setRows(d)
    })
  }, [])

  return (
    <div className="px-4 py-5 pb-28">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-white">Site Content</h1>
      <p className="mt-1 text-[14px] text-t3">Tap a section to edit its content, design and settings.</p>
      <div className="card-surface mt-5 divide-y divide-white/[0.05] overflow-hidden">
        {rows.map((s) => (
          <button
            key={s.key}
            onClick={() => onOpen(s.key as NavKey)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-white/[0.04]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
              <Icon name={s.icon} size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-medium text-white">{s.name}</span>
              <span className="text-[12px] text-t3">Updated {s.updated}</span>
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                s.status === 'Published' ? 'bg-ok/15 text-ok' : 'bg-warn/15 text-warn'
              }`}
            >
              {s.status}
            </span>
            <Icon name="chevronRight" size={16} className="text-t3" />
          </button>
        ))}
      </div>
    </div>
  )
}

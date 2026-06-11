export type NavKey =
  | 'dashboard'
  | 'hero'
  | 'trusted'
  | 'services'
  | 'impact'
  | 'cta'
  | 'footer'
  | 'navigation'
  | 'pages'
  | 'blog'
  | 'media'
  | 'forms'
  | 'settings'
  | 'users'
  | 'audit'

export type NavItem = {
  key: NavKey
  label: string
  icon: string
  children?: { key: NavKey; label: string }[]
}

export const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  {
    key: 'hero',
    label: 'Site Content',
    icon: 'content',
    children: [
      { key: 'hero', label: 'Hero Section' },
      { key: 'trusted', label: 'Trusted By' },
      { key: 'services', label: 'Services' },
      { key: 'impact', label: 'Impact Metrics' },
      { key: 'cta', label: 'CTA Banner' },
      { key: 'footer', label: 'Footer' },
      { key: 'navigation', label: 'Navigation' },
    ],
  },
  { key: 'pages', label: 'Pages', icon: 'pages' },
  { key: 'media', label: 'Media Library', icon: 'media' },
  { key: 'forms', label: 'Forms', icon: 'forms' },
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'audit', label: 'Audit Log', icon: 'audit' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]

export const SECTIONS = [
  { key: 'hero', name: 'Hero Section', icon: 'hero', status: 'Published', updated: 'May 24, 2025' },
  { key: 'trusted', name: 'Trusted By', icon: 'trusted', status: 'Published', updated: 'May 22, 2025' },
  { key: 'services', name: 'Services', icon: 'services', status: 'Published', updated: 'May 21, 2025' },
  { key: 'impact', name: 'Impact Metrics', icon: 'impact', status: 'Published', updated: 'May 20, 2025' },
  { key: 'cta', name: 'CTA Banner', icon: 'cta', status: 'Draft', updated: 'May 18, 2025' },
  { key: 'footer', name: 'Footer', icon: 'footer', status: 'Published', updated: 'May 12, 2025' },
] as const

export const METRICS = [
  { value: '12', label: 'Sections', sub: 'Manage all page sections', icon: 'layout' },
  { value: '48', label: 'Content Blocks', sub: 'Total editable blocks', icon: 'blog' },
  { value: '1.2K', label: 'Page Views', sub: 'Last 30 days', icon: 'eye' },
]

export const QUICK_ACTIONS: { key: NavKey; label: string; icon: string }[] = [
  { key: 'hero', label: 'Edit Hero Section', icon: 'hero' },
  { key: 'services', label: 'Manage Services', icon: 'services' },
  { key: 'impact', label: 'Update Impact Stats', icon: 'impact' },
  { key: 'trusted', label: 'Manage Trusted By', icon: 'trusted' },
  { key: 'cta', label: 'Update CTA Banner', icon: 'cta' },
  { key: 'footer', label: 'Manage Footer', icon: 'footer' },
]

export const RECENT_CHANGES = [
  { who: 'Admin User', what: 'Hero Section updated', when: '2 hours ago', icon: 'hero' },
  { who: 'Sarah Chen', what: 'Services updated', when: 'Yesterday', icon: 'services' },
  { who: 'Admin User', what: 'Impact Metrics updated', when: '2 days ago', icon: 'impact' },
]

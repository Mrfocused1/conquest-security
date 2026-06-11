import { supabase } from './supabase'
import type { HeroContent, HeroDesign, Visibility, Seo } from '../store/cms'

export type Result = { ok: boolean; error?: string }

/** Best-effort audit trail entry; never throws. */
export async function logAudit(action: string, section: string, summary: string) {
  try {
    const { data } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      actor_name: data.user?.email ?? 'Unknown',
      action,
      entity_type: 'section',
      section,
      summary,
    })
  } catch {
    /* audit must never block saves */
  }
}

export type HeroBundle = {
  content: HeroContent
  design: HeroDesign
  visibility: Visibility
  seo: Seo
  customCss: string
}

const ICON_FOR_TYPE: Record<string, string> = {
  hero: 'hero',
  trusted_by: 'trusted',
  services: 'services',
  impact: 'impact',
  cta: 'cta',
  footer: 'footer',
  navigation: 'navigation',
}

export type SectionRow = {
  key: string
  name: string
  icon: string
  status: 'Published' | 'Draft'
  updated: string
}

/** Load all homepage sections for the section manager. */
export async function fetchSections(): Promise<SectionRow[] | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('slug,name,type,status,updated_at,sort_order')
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  return data.map((r) => ({
    key: r.slug as string,
    name: r.name as string,
    icon: ICON_FOR_TYPE[r.type as string] ?? 'hero',
    status: (r.status === 'published' ? 'Published' : 'Draft') as 'Published' | 'Draft',
    updated: new Date(r.updated_at as string).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }))
}

/** Load the hero section content/design/visibility/seo from Supabase. */
export async function fetchHero(): Promise<HeroBundle | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('content,design,seo,custom_css_class,visible_desktop,visible_tablet,visible_mobile')
    .eq('slug', 'hero')
    .maybeSingle()
  if (error || !data) return null

  const c = (data.content ?? {}) as Record<string, string>
  const d = (data.design ?? {}) as Record<string, unknown>
  const s = (data.seo ?? {}) as Record<string, string>

  return {
    content: {
      topLabel: c.top_label ?? '',
      heading: c.heading ?? '',
      description: c.description ?? '',
      primaryText: c.primary_text ?? '',
      primaryLink: c.primary_link ?? '',
      secondaryText: c.secondary_text ?? '',
      secondaryLink: c.secondary_link ?? '',
    },
    design: {
      logoSize: Number(d.logo_size ?? 420),
      logoPosition: (d.logo_position as HeroDesign['logoPosition']) ?? 'Right',
      logoAlt: (d.logo_alt as string) ?? 'Conquest Security Logo',
      logoUrl: (d.logo_url as string) ?? '',
      bgStyle: (d.bg_style as string) ?? 'Dark Gradient',
      topPadding: Number(d.top_padding ?? 120),
      bottomPadding: Number(d.bottom_padding ?? 120),
      glow: d.glow !== false,
      animation: d.animation !== false,
    },
    visibility: {
      desktop: data.visible_desktop !== false,
      tablet: data.visible_tablet !== false,
      mobile: data.visible_mobile !== false,
    },
    seo: {
      metaTitle: s.meta_title ?? '',
      metaDescription: s.meta_description ?? '',
      altText: s.alt_text ?? '',
    },
    customCss: (data.custom_css_class as string) ?? '',
  }
}

/** Persist the hero section. Requires an authenticated session (RLS). */
export async function saveHero(b: HeroBundle): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('sections')
    .update({
      content: {
        top_label: b.content.topLabel,
        heading: b.content.heading,
        description: b.content.description,
        primary_text: b.content.primaryText,
        primary_link: b.content.primaryLink,
        secondary_text: b.content.secondaryText,
        secondary_link: b.content.secondaryLink,
      },
      design: {
        logo_size: b.design.logoSize,
        logo_position: b.design.logoPosition,
        logo_alt: b.design.logoAlt,
        logo_url: b.design.logoUrl,
        bg_style: b.design.bgStyle,
        top_padding: b.design.topPadding,
        bottom_padding: b.design.bottomPadding,
        glow: b.design.glow,
        animation: b.design.animation,
      },
      seo: {
        meta_title: b.seo.metaTitle,
        meta_description: b.seo.metaDescription,
        alt_text: b.seo.altText,
      },
      custom_css_class: b.customCss,
      visible_desktop: b.visibility.desktop,
      visible_tablet: b.visibility.tablet,
      visible_mobile: b.visibility.mobile,
    })
    .eq('slug', 'hero')
  if (error) return { ok: false, error: error.message }
  void logAudit('update', 'Hero Section', 'Updated hero section from CMS')
  return { ok: true }
}

/* ===================== Generic section content (CTA etc.) ===================== */

export async function fetchSectionContent(slug: string): Promise<Record<string, string> | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('content')
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data) return null
  return (data.content ?? {}) as Record<string, string>
}

export async function saveSectionContent(
  slug: string,
  sectionName: string,
  content: Record<string, string>,
): Promise<Result> {
  const { error } = await supabase.from('sections').update({ content }).eq('slug', slug)
  if (error) return { ok: false, error: error.message }
  void logAudit('update', sectionName, `Updated ${sectionName} from CMS`)
  return { ok: true }
}

/* ===================== Sections: order + status ===================== */

export async function saveSectionOrder(slugs: string[]): Promise<Result> {
  for (let i = 0; i < slugs.length; i++) {
    const { error } = await supabase.from('sections').update({ sort_order: i }).eq('slug', slugs[i])
    if (error) return { ok: false, error: error.message }
  }
  void logAudit('reorder', 'Homepage', 'Reordered homepage sections')
  return { ok: true }
}

export async function saveSectionStatus(slug: string, published: boolean): Promise<Result> {
  const { error } = await supabase
    .from('sections')
    .update({ status: published ? 'published' : 'draft' })
    .eq('slug', slug)
  if (error) return { ok: false, error: error.message }
  void logAudit(published ? 'publish' : 'unpublish', slug, `Set ${slug} to ${published ? 'published' : 'draft'}`)
  return { ok: true }
}

/* ===================== Trusted logos ===================== */

export type TrustedLogo = { id: string; name: string; sort_order: number }

export async function fetchTrustedLogos(): Promise<TrustedLogo[] | null> {
  const { data, error } = await supabase
    .from('trusted_logos')
    .select('id,name,sort_order')
    .order('sort_order')
  return error ? null : (data as TrustedLogo[])
}

export async function saveTrustedLogos(rows: TrustedLogo[], deletedIds: string[]): Promise<Result> {
  for (const id of deletedIds) {
    const { error } = await supabase.from('trusted_logos').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
  }
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    if (r.id.startsWith('new-')) {
      const { error } = await supabase.from('trusted_logos').insert({ name: r.name, sort_order: i })
      if (error) return { ok: false, error: error.message }
    } else {
      const { error } = await supabase
        .from('trusted_logos')
        .update({ name: r.name, sort_order: i })
        .eq('id', r.id)
      if (error) return { ok: false, error: error.message }
    }
  }
  void logAudit('update', 'Trusted By', 'Updated trusted-by logos')
  return { ok: true }
}

/* ===================== Services ===================== */

export type ServiceRow = {
  id: string
  title: string
  description: string | null
  icon: string | null
  sort_order: number
}

export async function fetchServices(): Promise<ServiceRow[] | null> {
  const { data, error } = await supabase
    .from('services')
    .select('id,title,description,icon,sort_order')
    .order('sort_order')
  return error ? null : (data as ServiceRow[])
}

export async function saveServices(rows: ServiceRow[]): Promise<Result> {
  for (const r of rows) {
    const { error } = await supabase
      .from('services')
      .update({ title: r.title, description: r.description })
      .eq('id', r.id)
    if (error) return { ok: false, error: error.message }
  }
  void logAudit('update', 'Services', 'Updated service cards')
  return { ok: true }
}

/* ===================== Impact metrics ===================== */

export type MetricRow = { id: string; value: string; label: string; sort_order: number }

export async function fetchMetrics(): Promise<MetricRow[] | null> {
  const { data, error } = await supabase
    .from('impact_metrics')
    .select('id,value,label,sort_order')
    .order('sort_order')
  return error ? null : (data as MetricRow[])
}

export async function saveMetrics(rows: MetricRow[]): Promise<Result> {
  for (const r of rows) {
    const { error } = await supabase
      .from('impact_metrics')
      .update({ value: r.value, label: r.label })
      .eq('id', r.id)
    if (error) return { ok: false, error: error.message }
  }
  void logAudit('update', 'Impact Metrics', 'Updated impact metrics')
  return { ok: true }
}

/* ===================== Footer links ===================== */

export type FooterLink = {
  id: string
  column_title: string
  label: string
  href: string | null
  sort_order: number
}

export async function fetchFooterLinks(): Promise<FooterLink[] | null> {
  const { data, error } = await supabase
    .from('footer_links')
    .select('id,column_title,label,href,sort_order')
    .order('column_title')
    .order('sort_order')
  return error ? null : (data as FooterLink[])
}

export async function saveFooterLinks(rows: FooterLink[], deletedIds: string[]): Promise<Result> {
  for (const id of deletedIds) {
    const { error } = await supabase.from('footer_links').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
  }
  for (const r of rows) {
    if (r.id.startsWith('new-')) {
      const { error } = await supabase.from('footer_links').insert({
        column_title: r.column_title,
        label: r.label,
        href: r.href,
        sort_order: r.sort_order,
      })
      if (error) return { ok: false, error: error.message }
    } else {
      const { error } = await supabase
        .from('footer_links')
        .update({ label: r.label, href: r.href, sort_order: r.sort_order })
        .eq('id', r.id)
      if (error) return { ok: false, error: error.message }
    }
  }
  void logAudit('update', 'Footer', 'Updated footer links')
  return { ok: true }
}

/* ===================== Navigation ===================== */

export type NavRow = { id: string; label: string; href: string | null; sort_order: number }

export async function fetchNav(): Promise<NavRow[] | null> {
  const { data, error } = await supabase
    .from('nav_items')
    .select('id,label,href,sort_order')
    .eq('location', 'header')
    .order('sort_order')
  return error ? null : (data as NavRow[])
}

export async function saveNav(rows: NavRow[], deletedIds: string[]): Promise<Result> {
  for (const id of deletedIds) {
    const { error } = await supabase.from('nav_items').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
  }
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    if (r.id.startsWith('new-')) {
      const { error } = await supabase
        .from('nav_items')
        .insert({ label: r.label, href: r.href, location: 'header', sort_order: i })
      if (error) return { ok: false, error: error.message }
    } else {
      const { error } = await supabase
        .from('nav_items')
        .update({ label: r.label, href: r.href, sort_order: i })
        .eq('id', r.id)
      if (error) return { ok: false, error: error.message }
    }
  }
  void logAudit('update', 'Navigation', 'Updated navigation menu')
  return { ok: true }
}

/* ===================== Pages ===================== */

export type PageRow = { id: string; slug: string; title: string; status: string; updated_at: string }

export async function fetchPages(): Promise<PageRow[] | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('id,slug,title,status,updated_at')
    .order('updated_at', { ascending: false })
  return error ? null : (data as PageRow[])
}

export async function createPage(title: string): Promise<Result> {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
  const { error } = await supabase.from('pages').insert({ title, slug, status: 'draft' })
  if (error) return { ok: false, error: error.message }
  void logAudit('create', 'Pages', `Created page "${title}"`)
  return { ok: true }
}

export async function setPageStatus(id: string, status: 'published' | 'draft'): Promise<Result> {
  const { error } = await supabase.from('pages').update({ status }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  void logAudit(status === 'published' ? 'publish' : 'unpublish', 'Pages', `Page status set to ${status}`)
  return { ok: true }
}

export async function deletePage(id: string): Promise<Result> {
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  void logAudit('delete', 'Pages', 'Deleted a page')
  return { ok: true }
}

/* ===================== Form submissions ===================== */

export type SubmissionRow = {
  id: string
  form_type: string
  name: string | null
  email: string | null
  company: string | null
  job_title: string | null
  phone: string | null
  company_size: string | null
  service: string | null
  message: string | null
  status: 'new' | 'read' | 'archived'
  created_at: string
}

export async function fetchSubmissions(): Promise<SubmissionRow[] | null> {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id,form_type,name,email,company,job_title,phone,company_size,service,message,status,created_at')
    .order('created_at', { ascending: false })
  return error ? null : (data as SubmissionRow[])
}

export async function setSubmissionStatus(
  id: string,
  status: 'new' | 'read' | 'archived',
): Promise<Result> {
  const { error } = await supabase.from('form_submissions').update({ status }).eq('id', id)
  return error ? { ok: false, error: error.message } : { ok: true }
}

export async function deleteSubmission(id: string): Promise<Result> {
  const { error } = await supabase.from('form_submissions').delete().eq('id', id)
  return error ? { ok: false, error: error.message } : { ok: true }
}

/* ===================== Site settings ===================== */

export type SiteSettings = { site_name: string; primary_domain: string | null }

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('site_name,primary_domain')
    .eq('id', 1)
    .maybeSingle()
  return error || !data ? null : (data as SiteSettings)
}

export async function saveSiteSettings(s: SiteSettings): Promise<Result> {
  const { error } = await supabase
    .from('site_settings')
    .update({ site_name: s.site_name, primary_domain: s.primary_domain })
    .eq('id', 1)
  if (error) return { ok: false, error: error.message }
  void logAudit('update', 'Settings', 'Updated site settings')
  return { ok: true }
}

/* ===================== Dashboard stats + recent activity ===================== */

export type DashboardStats = { sections: number; blocks: number; views: string }

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const tables = ['services', 'impact_metrics', 'trusted_logos', 'footer_links', 'nav_items']
    const sections = await supabase.from('sections').select('id', { count: 'exact', head: true })
    if (sections.error) return null
    let blocks = 0
    for (const t of tables) {
      const r = await supabase.from(t).select('id', { count: 'exact', head: true })
      blocks += r.count ?? 0
    }
    const { data: views } = await supabase.rpc('page_views_30d')
    return {
      sections: sections.count ?? 0,
      blocks,
      views: views != null ? compactNumber(Number(views)) : '—',
    }
  } catch {
    return null
  }
}

export type AuditRow = { actor_name: string | null; summary: string | null; section: string | null; created_at: string }

export async function fetchRecentAudit(limit = 3): Promise<AuditRow[] | null> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('actor_name,summary,section,created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return error ? null : (data as AuditRow[])
}

/* ===================== Media library (Supabase Storage) ===================== */

export type MediaRow = {
  id: string
  name: string
  type: 'image' | 'document' | 'logo' | 'icon'
  url: string
  size_bytes: number | null
  created_at: string
}

export async function fetchMedia(): Promise<MediaRow[] | null> {
  const { data, error } = await supabase
    .from('media')
    .select('id,name,type,url,size_bytes,created_at')
    .order('created_at', { ascending: false })
  return error ? null : (data as MediaRow[])
}

function slugifyFile(name: string): string {
  const dot = name.lastIndexOf('.')
  const base = (dot >= 0 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : ''
  // unique-ish without Date.now() concerns in the browser (Date is fine here)
  return `${base || 'file'}-${Math.floor(Date.now() / 1000)}${ext}`
}

export type UploadResult = { ok: boolean; url?: string; error?: string }

export async function uploadMedia(
  file: File,
  type: MediaRow['type'] = 'image',
): Promise<UploadResult> {
  const path = slugifyFile(file.name)
  const up = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (up.error) return { ok: false, error: up.error.message }
  const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
  const url = pub.publicUrl
  const { data: userData } = await supabase.auth.getUser()
  await supabase.from('media').insert({
    name: file.name,
    type,
    url,
    size_bytes: file.size,
  })
  void logAudit('upload', 'Media Library', `Uploaded ${file.name}`)
  void userData
  return { ok: true, url }
}

export async function deleteMedia(row: MediaRow): Promise<Result> {
  // Best-effort remove the storage object (derive path from public URL).
  const marker = '/object/public/media/'
  const idx = row.url.indexOf(marker)
  if (idx >= 0) {
    const path = row.url.slice(idx + marker.length)
    await supabase.storage.from('media').remove([path])
  }
  const { error } = await supabase.from('media').delete().eq('id', row.id)
  if (error) return { ok: false, error: error.message }
  void logAudit('delete', 'Media Library', `Deleted ${row.name}`)
  return { ok: true }
}

/* ===================== Hero logo (stored in design jsonb) ===================== */

export async function saveHeroLogo(url: string): Promise<Result> {
  const { data } = await supabase.from('sections').select('design').eq('slug', 'hero').maybeSingle()
  const design = ((data?.design as Record<string, unknown>) ?? {})
  design.logo_url = url
  const { error } = await supabase.from('sections').update({ design }).eq('slug', 'hero')
  if (error) return { ok: false, error: error.message }
  void logAudit('update', 'Hero Section', 'Changed hero logo')
  return { ok: true }
}

/* ===================== User management (profiles) ===================== */

export type ProfileRow = {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author' | 'viewer'
  status: 'active' | 'invited' | 'suspended'
  last_active_at: string | null
}

export async function fetchProfiles(): Promise<ProfileRow[] | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,name,email,role,status,last_active_at')
    .order('created_at')
  return error ? null : (data as ProfileRow[])
}

export async function fetchMyRole(): Promise<ProfileRow['role'] | null> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return null
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', u.user.id)
    .maybeSingle()
  return (data?.role as ProfileRow['role']) ?? null
}

export async function inviteUser(
  name: string,
  email: string,
  role: ProfileRow['role'],
): Promise<Result> {
  const { error } = await supabase
    .from('profiles')
    .insert({ name, email, role, status: 'invited' })
  if (error) return { ok: false, error: error.message }
  void logAudit('invite', 'Users', `Invited ${email} as ${role}`)
  return { ok: true }
}

export async function updateProfile(
  id: string,
  patch: Partial<Pick<ProfileRow, 'role' | 'status'>>,
): Promise<Result> {
  const { error } = await supabase.from('profiles').update(patch).eq('id', id)
  if (error) return { ok: false, error: error.message }
  void logAudit('update', 'Users', 'Updated a team member')
  return { ok: true }
}

export async function deleteProfile(id: string): Promise<Result> {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  void logAudit('delete', 'Users', 'Removed a team member')
  return { ok: true }
}

/* ===================== Audit log (full list) ===================== */

export type AuditFull = {
  id: string
  actor_name: string | null
  action: string
  entity_type: string | null
  section: string | null
  summary: string | null
  created_at: string
}

export async function fetchAuditLog(limit = 100): Promise<AuditFull[] | null> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id,actor_name,action,entity_type,section,summary,created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return error ? null : (data as AuditFull[])
}

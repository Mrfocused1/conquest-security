// Copies the static marketing homepage (/site) into the deploy root (/dist),
// so the final output is:
//   dist/index.html          -> marketing homepage  (served at /)
//   dist/assets/*            -> homepage assets
//   dist/admin/index.html    -> CMS app             (served at /admin)
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const site = resolve(root, 'site')
const dist = resolve(root, 'dist')

if (!existsSync(dist)) mkdirSync(dist, { recursive: true })
cpSync(site, dist, { recursive: true })
console.log('[postbuild] copied marketing site -> dist/ (homepage at /, CMS at /admin)')

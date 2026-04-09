/**
 * Build Populi-style static HTML for an AIMA deliverable repo (GitHub Pages).
 * Reads variant.json + index.md → dist/index.html + copied styles.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

function loadVariant() {
  const p = path.join(ROOT, 'variant.json')
  if (!existsSync(p)) {
    throw new Error(`Missing ${p}`)
  }
  return JSON.parse(readFileSync(p, 'utf8'))
}

function stripFrontmatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function preprocessFences(md) {
  const directiveKinds = ['note', 'important', 'warning', 'seealso', 'tip', 'caution']
  let s = md
  for (const kind of directiveKinds) {
    const re = new RegExp('```\\{' + kind + '\\}\\r?\\n([\\s\\S]*?)```', 'g')
    s = s.replace(re, (_, body) => {
      const inner = marked.parse(body.trim())
      const mod =
        kind === 'important'
          ? 'populi-demo__callout--important'
          : kind === 'warning' || kind === 'caution'
            ? 'populi-demo__callout--warning'
            : 'populi-demo__callout--note'
      return `\n\n<aside class="populi-demo__callout ${mod}">${inner}</aside>\n\n`
    })
  }
  return s
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const NAV_ITEMS = [
  'Dashboard',
  'Syllabus',
  'Lessons',
  'Files',
  'Assignments',
  'Discussions',
  'Tests',
  'Calendar',
  'Roster',
  'Gradebook',
  'Attendance',
  'Reporting',
  'Chat',
  'Settings',
]

function renderShellHtml({
  courseCode,
  courseTitle,
  pillLabel,
  alertText,
  termLabel,
  bodyHtml,
  description,
  programsCatalogUrl,
}) {
  const pill = pillLabel ?? `${String(courseCode).replace(/\s+/g, '')}: Dashboard`
  const navItemsHtml = NAV_ITEMS.map(
    (item) =>
      `<span class="populi-demo__nav-item${item === 'Dashboard' ? ' populi-demo__nav-item--active' : ''}">${escapeHtml(item)}</span>`,
  ).join('\n        ')

  const descPara = description
    ? `<p class="populi-demo__panel-body">${escapeHtml(description)}</p>`
    : '<p class="populi-demo__panel-body populi-demo__panel-body--empty">Product line details on the programs catalog.</p>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(courseCode)}: ${escapeHtml(courseTitle)} — Castalia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./styles/populi-demo.css" />
  <link rel="stylesheet" href="./styles/populi-demo-standalone.css" />
</head>
<body>
  <div class="populi-demo populi-demo--standalone">
    <header class="populi-demo__topbar">
      <ul class="populi-demo__topbar-links">
        <li><a href="https://castalia.institute">Home</a></li>
        <li><a href="https://castalia.institute/membership">My Profile</a></li>
        <li><a href="${escapeHtml(programsCatalogUrl)}">My Courses</a></li>
        <li><a href="https://castalia.institute/contact">Directory</a></li>
      </ul>
      <span class="populi-demo__pill">${escapeHtml(pill)}</span>
    </header>

    <div class="populi-demo__alert">${escapeHtml(alertText)}</div>

    <div class="populi-demo__layout">
      <aside class="populi-demo__sidebar" aria-label="Course navigation">
        <div class="populi-demo__course-tile" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <rect width="64" height="64" rx="6" fill="#2d2d32" />
            <ellipse cx="32" cy="22" rx="10" ry="9" stroke="#a1a1aa" stroke-width="2" />
            <path d="M20 38c2-6 8-9 12-9s10 3 12 9v4H20v-4z" fill="#71717a" />
            <rect x="10" y="44" width="44" height="10" rx="2" stroke="#71717a" stroke-width="1.5" />
            <rect x="14" y="47" width="36" height="4" rx="1" fill="#52525b" />
          </svg>
        </div>
        <nav class="populi-demo__nav">
        ${navItemsHtml}
        </nav>
        <div class="populi-demo__nav-footer">Demo layout · not interactive</div>
      </aside>

      <div class="populi-demo__main">
        <div class="populi-demo__course-header">
          <h1>${escapeHtml(courseCode)}: ${escapeHtml(courseTitle)}</h1>
          <div class="populi-demo__course-header-actions">
            <label class="sr-only" for="populi-term-select">Term</label>
            <select id="populi-term-select" class="populi-demo__select" disabled>
              <option>${escapeHtml(termLabel)}</option>
            </select>
            <button type="button" class="populi-demo__icon-btn" aria-label="Menu" disabled>⋮</button>
          </div>
        </div>

        <div class="populi-demo__columns">
          <div class="populi-demo__primary">
            <div class="populi-demo__primary-inner">
${bodyHtml}
            </div>
          </div>
          <aside class="populi-demo__secondary">
            <section class="populi-demo__panel">
              <div class="populi-demo__panel-head">
                <h2 class="populi-demo__panel-title">About this deliverable</h2>
              </div>
              ${descPara}
            </section>
            <section class="populi-demo__panel">
              <div class="populi-demo__panel-head">
                <h2 class="populi-demo__panel-title">Programs catalog</h2>
              </div>
              <p class="populi-demo__panel-body">
                <a href="${escapeHtml(programsCatalogUrl)}">Open AIMA 5001 demos</a> on the Castalia programs site.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  </div>
  <style>
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  </style>
</body>
</html>
`
}

function main() {
  const variant = loadVariant()
  const mdPath = path.join(ROOT, 'index.md')
  if (!existsSync(mdPath)) {
    throw new Error('Missing index.md')
  }

  let md = readFileSync(mdPath, 'utf8')
  md = stripFrontmatter(md)
  md = preprocessFences(md)

  marked.setOptions({ gfm: true })
  const bodyHtml = marked.parse(md)

  const html = renderShellHtml({
    courseCode: variant.courseCode,
    courseTitle: variant.courseTitle,
    pillLabel: variant.pillLabel,
    alertText: variant.alertText ?? 'This course opens on Aug 31, 2026',
    termLabel: variant.termLabel ?? '2026-2027: Fall Semester 2026 A',
    bodyHtml,
    description: variant.description ?? '',
    programsCatalogUrl: variant.programsCatalogUrl ?? 'https://programs.castalia.institute/catalog/aima',
  })

  const dist = path.join(ROOT, 'dist')
  if (existsSync(dist)) {
    rmSync(dist, { recursive: true, force: true })
  }
  mkdirSync(path.join(dist, 'styles'), { recursive: true })
  writeFileSync(path.join(dist, 'index.html'), html, 'utf8')

  const styles = ['populi-demo.css', 'populi-demo-standalone.css']
  for (const f of styles) {
    const src = path.join(ROOT, 'styles', f)
    if (!existsSync(src)) {
      throw new Error(`Missing style file: ${src}`)
    }
    copyFileSync(src, path.join(dist, 'styles', f))
  }

  console.log('[build-site] wrote dist/index.html (Populi layout)')
}

main()

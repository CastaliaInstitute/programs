#!/usr/bin/env node
/**
 * Build FULL IMS Common Cartridges (.imscc) from a Castalia course repo — a **student** cartridge
 * and an **instructor** cartridge — with the real book content (markdown + notebooks) rendered as
 * beautiful, themed HTML and a proper module tree. Ready to import into Populi.
 *
 * Run: `cd automation && npm i` once, then
 *   node build-cartridge.mjs --course <repoDir> --code AIN6001 [--title "..."] [--out DIR]
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import yaml from 'js-yaml'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d }
const COURSE = path.resolve(arg('course', '.'))
const CODE = arg('code', 'COURSE')
const OUT = path.resolve(arg('out', path.join(process.cwd(), '.cartridges')))

const read = (p) => fs.readFileSync(p, 'utf8')
const exists = (p) => fs.existsSync(p)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const slug = (s) => s.replace(/\.(md|ipynb)$/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()

/** Turn MyST directive fences into readable HTML before markdown-it. */
function demyst(text) {
  return text
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '') // strip YAML front matter
    .replace(/^\s*:(class|name|width|align|height|figclass|nowrap|label|caption):.*$/gm, '') // MyST directive options
    .replace(/```\{(note|tip|important|admonition|seealso|hint)\}([^\n]*)\n([\s\S]*?)```/g,
      (_, k, t, body) => `\n> **${t.trim() || k[0].toUpperCase() + k.slice(1)}**\n>\n${body.trim().split('\n').map((l) => '> ' + l).join('\n')}\n`)
    .replace(/```\{(warning|caution|danger)\}([^\n]*)\n([\s\S]*?)```/g,
      (_, k, t, body) => `\n> **⚠ ${t.trim() || k[0].toUpperCase() + k.slice(1)}**\n>\n${body.trim().split('\n').map((l) => '> ' + l).join('\n')}\n`)
    .replace(/```\{[^}]+\}[^\n]*\n/g, '```\n') // other directives → plain code fence
}

function renderMd(text) { return md.render(demyst(text)) }

function renderIpynb(text) {
  const nb = JSON.parse(text)
  return (nb.cells || []).map((c) => {
    const src = Array.isArray(c.source) ? c.source.join('') : c.source || ''
    if (c.cell_type === 'markdown') return renderMd(src)
    if (c.cell_type === 'code' && src.trim()) return `<pre class="code">${esc(src)}</pre>`
    return ''
  }).join('\n')
}

function renderFile(base) {
  for (const ext of ['.md', '.ipynb']) {
    const p = path.join(COURSE, base + ext)
    if (exists(p)) return ext === '.md' ? renderMd(read(p)) : renderIpynb(read(p))
  }
  const direct = path.join(COURSE, base)
  if (exists(direct)) return base.endsWith('.ipynb') ? renderIpynb(read(direct)) : renderMd(read(direct))
  return null
}

function titleOf(base, fallback) {
  for (const ext of ['.md', '.ipynb']) {
    const p = path.join(COURSE, base + ext)
    if (exists(p)) {
      const raw = read(p)
      const src = ext === '.ipynb' ? (JSON.parse(raw).cells?.find((c) => c.cell_type === 'markdown')?.source || []).join('') : raw
      const h = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').match(/^#\s+(.+)$/m)
      if (h) return h[1].trim()
    }
  }
  return fallback
}

const THEME = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
:root{--paper:#F7F4ED;--ink:#21252E;--muted:#5C616C;--teal:#0E6E63;--teal-d:#0A544B;--gold:#B98B32;--rule:rgba(33,37,46,.14);--serif:'Fraunces','Iowan Old Style',Palatino,Georgia,serif;--sans:'Inter',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;--mono:ui-monospace,'JetBrains Mono',Menlo,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.65;font-size:17px}
.band{background:var(--ink);color:var(--paper);padding:12px 0}.band .in{max-width:820px;margin:0 auto;padding:0 28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;display:flex;justify-content:space-between;gap:16px}
.band.instr{background:#5A2A2A}
.wrap{max-width:820px;margin:0 auto;padding:44px 28px 72px}
.crumb{color:var(--teal);font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:12px;margin-bottom:8px}
h1{font-family:var(--serif);font-weight:600;font-size:38px;line-height:1.12;margin:.2em 0 .1em}
h1+hr,.wrap>hr:first-of-type{border:0}
h2{font-family:var(--serif);font-weight:600;font-size:25px;margin:1.7em 0 .4em}
h3{font-size:19px;margin:1.3em 0 .3em}
p{margin:.7em 0}a{color:var(--teal-d)}
ul,ol{margin:.7em 0;padding-left:1.3em}li{margin:.35em 0}
blockquote{background:#EFEBE0;border-left:4px solid var(--teal);border-radius:0 10px 10px 0;padding:12px 20px;margin:1.2em 0;color:#31363f}
blockquote strong{color:var(--teal-d)}
code{font-family:var(--mono);background:#EFEBE0;padding:1px 6px;border-radius:5px;font-size:.9em}
pre,pre.code{background:#1B1F2A;color:#E7E9EE;border-radius:12px;padding:20px 22px;overflow:auto;font-family:var(--mono);font-size:14.5px;line-height:1.6}
pre code{background:none;color:inherit;padding:0}
table{border-collapse:collapse;margin:1.2em 0;width:100%}th,td{border:1px solid var(--rule);padding:8px 12px;text-align:left}th{background:#EFEBE0}
hr{border:0;border-top:1px solid var(--rule);margin:2em 0}
.foot{max-width:820px;margin:0 auto;padding:22px 28px;color:var(--muted);font-size:13px;border-top:1px solid var(--rule)}`

function pageHtml({ audience, crumb, title, body }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(CODE)} — ${esc(title)}</title><style>${THEME}</style></head><body>
<div class="band${audience === 'instructor' ? ' instr' : ''}"><div class="in"><span>Castalia Institute · ${esc(CODE)}</span><span>${audience === 'instructor' ? 'Instructor' : 'Student'}</span></div></div>
<div class="wrap"><div class="crumb">${esc(crumb)}</div>${body}</div>
<div class="foot">Castalia Institute · ${esc(CODE)} — ${esc(title)}${audience === 'instructor' ? ' · Instructor copy (do not distribute to students)' : ''}</div>
</body></html>`
}

// ---- Assemble the page/tree model from _toc.yml ----
const toc = yaml.load(read(path.join(COURSE, '_toc.yml')))
const frontTitles = { syllabus: 'Syllabus', 'student-guide': 'Student guide', 'technical-requirements': 'Technical requirements', resources: 'Resources' }

function buildFor(audience) {
  const web = []   // {id, title, html}
  const tree = []  // {id?, title, children?}
  const add = (base, crumb, forcedTitle) => {
    const html = renderFile(base)
    if (html == null) return null
    const id = slug(base)
    const title = forcedTitle || titleOf(base, id)
    web.push({ id, title, html: pageHtml({ audience, crumb, title, body: html }) })
    return { id, title }
  }

  // Intro + front matter
  const introT = add(toc.root || 'intro', CODE, `${CODE} — Course home`); if (introT) tree.push(introT)
  for (const ch of toc.chapters || []) {
    if (ch.sections) {
      // A module: folder item with children
      const modTitle = ch.title || titleOf(ch.file, 'Module')
      const modOverview = add(ch.file, modTitle, modTitle)
      const children = modOverview ? [modOverview] : []
      for (const s of ch.sections) { const t = add(s.file, modTitle); if (t) children.push(t) }
      // Assignment notebook (not always in TOC) + instructor-only notes
      const modDir = path.dirname(ch.file)
      const asg = add(path.join(modDir, 'assignment'), modTitle, `${modTitle} — Assignment`); if (asg) children.push(asg)
      if (audience === 'instructor') {
        const inotes = add(path.join(modDir, 'instructor-notes'), modTitle, `${modTitle} — Instructor notes`); if (inotes) children.push(inotes)
      }
      tree.push({ title: modTitle, children })
    } else {
      const t = add(ch.file, CODE, frontTitles[ch.file]); if (t) tree.push(t)
    }
  }

  // Instructor-only top-level docs
  if (audience === 'instructor') {
    const instrDocs = ['instructor-guide', 'assignment-solutions', 'assessment-evidence', 'accreditation',
      'FIRST_TIME_INSTRUCTOR_RUNBOOK', 'POPULI_FACULTY_LAUNCH_GUIDE', 'AURNOVA_A_PLUS_DELIVERY_PROTOCOL']
    const folder = { title: 'Instructor resources', children: [] }
    for (const d of instrDocs) { const t = add(d, 'Instructor resources'); if (t) folder.children.push(t) }
    if (folder.children.length) tree.push(folder)
  }
  return { web, tree }
}

function manifest(code, title, tree) {
  let n = 0
  const itemXml = (node, depth) => {
    const pad = '    '.repeat(depth)
    if (node.children) {
      return `${pad}<item identifier="F_${++n}"><title>${esc(node.title)}</title>\n${node.children.map((c) => itemXml(c, depth + 1)).join('\n')}\n${pad}</item>`
    }
    return `${pad}<item identifier="ITEM_${node.id}" identifierref="R_${node.id}"><title>${esc(node.title)}</title></item>`
  }
  const items = tree.map((t) => itemXml(t, 3)).join('\n')
  return { items }
}

function build(audience) {
  const { web, tree } = buildFor(audience)
  const dir = path.join(OUT, `${CODE}-${audience}`)
  const wr = path.join(dir, 'web_resources')
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(wr, { recursive: true })
  for (const p of web) fs.writeFileSync(path.join(wr, `${p.id}.html`), p.html)
  const { items } = manifest(CODE, CODE, tree)
  const resources = web.map((p) => `    <resource identifier="R_${p.id}" type="webcontent" href="web_resources/${p.id}.html"><file href="web_resources/${p.id}.html"/></resource>`).join('\n')
  const mani = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="manifest_${CODE}_${audience}" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/imscp_v1p2.xsd">
  <metadata><schema>IMS Common Cartridge</schema><schemaversion>1.1.0</schemaversion></metadata>
  <organizations><organization identifier="O_${CODE}" structure="rooted-hierarchy">
    <title>${esc(CODE)} — ${audience === 'instructor' ? 'Instructor' : 'Student'}</title>
${items}
  </organization></organizations>
  <resources>
${resources}
  </resources>
</manifest>`
  fs.writeFileSync(path.join(dir, 'imsmanifest.xml'), mani)
  const zip = path.join(OUT, `${CODE.toLowerCase()}-${audience}.imscc`)
  fs.rmSync(zip, { force: true })
  execFileSync('zip', ['-q', '-r', zip, '.'], { cwd: dir })
  console.log(`built ${path.relative(process.cwd(), zip)}  (${web.length} pages)`)
}

fs.mkdirSync(OUT, { recursive: true })
build('student')
build('instructor')

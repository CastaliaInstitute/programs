#!/usr/bin/env node
/**
 * Build a beautiful IMS Common Cartridge (.imscc) for a course — themed HTML content pages
 * (matching the Castalia slide theme) packaged as IMS CC 1.1.0, ready to import into Populi.
 *
 * Content pages are self-contained HTML (inline styles), so they render beautifully in any LMS.
 * Usage: node automation/build-cartridge.mjs [--out DIR]   (builds all Q1 courses)
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const OUT = (() => {
  const i = process.argv.indexOf('--out')
  return i >= 0 ? process.argv[i + 1] : path.join(process.cwd(), '.cartridges')
})()

// ---- Q1 courses (Term 1). Content is concise but real; extend per course as books mature. ----
const COURSES = [
  {
    code: 'AIN6001', mag: 'AI-101', title: 'Foundations of Artificial Intelligence',
    tagline: 'What makes an agent intelligent?',
    outcomes: [
      'Model a task as an agent acting in an environment.',
      'Specify a problem with PEAS before choosing a method.',
      'Explain what makes a decision rational under uncertainty.',
    ],
    modules: [
      ['Agents & Environments', 'The agent–environment loop; PEAS; rationality under uncertainty.'],
      ['Search as Problem-Solving', 'State spaces, uninformed and informed search, heuristics.'],
      ['Knowledge & Reasoning', 'Representations, inference, and where learning takes over.'],
    ],
  },
  {
    code: 'AIN6005', mag: 'AI-109', title: 'AI Ethics, Law & Policy',
    tagline: 'Building AI that is fair, accountable, and governable.',
    outcomes: [
      'Identify bias, privacy, and accountability risks in an AI system.',
      'Map a system to emerging regulation and governance controls.',
      'Write a responsible-AI assessment stakeholders can act on.',
    ],
    modules: [
      ['Foundations', 'Ethical theories for AI; bias, fairness, and representational harm.'],
      ['Rights & Accountability', 'Privacy, consent, transparency, and explainability.'],
      ['Law & Governance', 'Emerging regulation, governance programs, and incident response.'],
    ],
  },
  {
    code: 'AIN6007', mag: 'CS-100', title: 'Applied AI Programming with Python',
    tagline: 'From zero to running, maintainable AI code.',
    outcomes: [
      'Read, run, and modify Python for AI without prior programming.',
      'Structure a small project with tests and reproducible environments.',
      'Package and explain an end-to-end AI component.',
    ],
    modules: [
      ['Python Foundations', 'From zero: values, control flow, functions, and reading code.'],
      ['Data & Libraries', 'Working with data using Python’s scientific stack.'],
      ['Building & Shipping', 'APIs, testing, packaging, and a small deployed component.'],
    ],
  },
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function page(course, title, bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(course.code)} — ${esc(title)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
:root{--paper:#F7F4ED;--ink:#21252E;--muted:#5C616C;--teal:#0E6E63;--teal-d:#0A544B;--gold:#B98B32;--rule:rgba(33,37,46,.14);
--serif:'Fraunces','Iowan Old Style',Palatino,Georgia,serif;--sans:'Inter',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;--mono:ui-monospace,'JetBrains Mono',Menlo,monospace;}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.65;font-size:17px}
.band{background:var(--ink);color:var(--paper);padding:12px 0}.band .in{max-width:820px;margin:0 auto;padding:0 28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;display:flex;justify-content:space-between}
.wrap{max-width:820px;margin:0 auto;padding:52px 28px 72px}
.eyebrow{color:var(--teal);font-weight:600;letter-spacing:.16em;text-transform:uppercase;font-size:13px}
h1{font-family:var(--serif);font-weight:600;font-size:42px;line-height:1.1;margin:.35em 0 0}
h1+.rule{width:60px;height:4px;background:var(--gold);border-radius:2px;margin:22px 0 6px}
h2{font-family:var(--serif);font-weight:600;font-size:26px;margin:1.8em 0 .5em}
p{margin:.7em 0}.tagline{font-family:var(--serif);font-size:22px;color:var(--muted);margin-top:14px}
ul{padding-left:0;list-style:none;margin:1em 0}ul li{position:relative;padding-left:30px;margin:.55em 0}
ul li::before{content:'';position:absolute;left:0;top:.62em;width:10px;height:10px;background:var(--teal);border-radius:3px}
.callout{background:#EFEBE0;border-left:4px solid var(--teal);border-radius:0 10px 10px 0;padding:18px 22px;margin:1.4em 0}
.callout b{color:var(--teal-d)}
.grid{display:grid;gap:16px;margin:1.2em 0}
.card{background:#fff;border:1px solid var(--rule);border-radius:12px;padding:18px 20px}
.card .n{font-family:var(--serif);color:var(--gold);font-size:18px}.card h3{margin:.1em 0 .3em;font-size:19px}
a{color:var(--teal-d)}code{font-family:var(--mono);background:#EFEBE0;padding:1px 6px;border-radius:5px;font-size:.9em}
.foot{max-width:820px;margin:0 auto;padding:24px 28px;color:var(--muted);font-size:13px;border-top:1px solid var(--rule)}
</style></head><body>
<div class="band"><div class="in"><span>Castalia Institute</span><span>${esc(course.code)}</span></div></div>
<div class="wrap">${bodyHtml}</div>
<div class="foot">Castalia Institute · ${esc(course.code)} — ${esc(course.title)}</div>
</body></html>`
}

function pagesFor(c) {
  const modCards = c.modules.map((m, i) => `<div class="card"><div class="n">Module ${i + 1}</div><h3>${esc(m[0])}</h3><p>${esc(m[1])}</p></div>`).join('')
  const outcomes = c.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')
  return [
    ['home', 'Course home', `<div class="eyebrow">${esc(c.code)} · Aurnova MSAI</div>
      <h1>${esc(c.title)}</h1><div class="rule"></div><p class="tagline">${esc(c.tagline)}</p>
      <p>This course is delivered as a Castalia course: readable material here in your LMS, with the
      hands-on work in a private GitHub repository and cloud workspace. Completion is an oral
      Socratic review that earns a verifiable credential.</p>
      <h2>What's inside</h2><div class="grid">${modCards}</div>`],
    ['syllabus', 'Syllabus', `<div class="eyebrow">${esc(c.code)}</div><h1>Syllabus</h1><div class="rule"></div>
      <h2>Learning outcomes</h2><ul>${outcomes}</ul>
      <h2>How you'll work</h2>
      <div class="callout"><b>Do the work in your course repository.</b> Read here, then open the
      repo (and inqspace workspace) linked from your enrollment to run and modify code.</div>
      <h2>Assessment</h2><p>Completion is a <b>Socratic defense</b>: three faculty question you on the
      material and judge fluency. A pass records verifiable evidence and issues a credential.</p>`],
    ['work', 'How to work in this course', `<div class="eyebrow">${esc(c.code)}</div>
      <h1>How to work in this course</h1><div class="rule"></div>
      <ul><li>Read the material for each module here.</li>
      <li>Open your private course <b>repository</b> and its <b>inqspace</b> workspace — no local setup.</li>
      <li>Complete each module's assignment by running and modifying guided code.</li>
      <li>When ready, sit the <b>Socratic defense</b> to earn your credential.</li></ul>
      <div class="callout">Your grades and enrollment live in Populi; your <b>work and credential</b>
      live in the repository and the Magisterium.</div>`],
  ]
}

function manifest(c, pages) {
  const items = pages.map((p) => `      <item identifier="ITEM_${p[0]}" identifierref="R_${p[0]}"><title>${esc(p[1])}</title></item>`).join('\n')
  const res = pages.map((p) => `    <resource identifier="R_${p[0]}" type="webcontent" href="web_resources/${p[0]}.html"><file href="web_resources/${p[0]}.html"/></resource>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="manifest_${c.code}" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1"
  xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/imscp_v1p2.xsd">
  <metadata><schema>IMS Common Cartridge</schema><schemaversion>1.1.0</schemaversion></metadata>
  <organizations><organization identifier="O_${c.code}" structure="rooted-hierarchy">
    <title>${esc(c.code)} — ${esc(c.title)}</title>
${items}
  </organization></organizations>
  <resources>
${res}
  </resources>
</manifest>`
}

fs.mkdirSync(OUT, { recursive: true })
for (const c of COURSES) {
  const dir = path.join(OUT, c.code)
  const web = path.join(dir, 'web_resources')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(web, { recursive: true })
  const pages = pagesFor(c)
  for (const p of pages) fs.writeFileSync(path.join(web, `${p[0]}.html`), page(c, p[1], p[2]))
  fs.writeFileSync(path.join(dir, 'imsmanifest.xml'), manifest(c, pages))
  const zip = path.join(OUT, `${c.code.toLowerCase()}.imscc`)
  fs.rmSync(zip, { force: true })
  execFileSync('zip', ['-q', '-r', zip, '.'], { cwd: dir })
  console.log('built', path.relative(process.cwd(), zip))
}

/**
 * Builds IMS Common Cartridges from the MyST project under web/demo-sources/ain2001/:
 *
 * 1) Full course: myst.yml TOC + all pages + PDF → aima-lms-demo.imscc
 * 2) Per deliverable: one MyST page + PDF → aima-basic-lms-demo.imscc, aima-delivery-lms-demo.imscc, …
 *
 * Output zips under web/public/demos/ and unpacked trees under web/public/demos/imscc-unpacked/<id>/
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AIMA_VARIANT_REPOS } from './aima-variant-repos.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const mystRoot = path.join(root, 'demo-sources', 'ain2001')
const mystYmlPath = path.join(mystRoot, 'myst.yml')
const imsccSrc = path.join(root, 'demos', 'aima-imscc-src')
const webRes = path.join(imsccSrc, 'web_resources')
const pdfSource = path.join(root, 'demos', 'aima-demo-content', 'week1-search-slides.pdf')
const outDir = path.join(root, 'public', 'demos')
const unpackedRoot = path.join(outDir, 'imscc-unpacked')

function parseMystToc(yml) {
  const nested = yml.match(/^\s+toc:\s*\n([\s\S]*?)(?=^\S[^:]*:|\n\S[^:\s]+:\s*$|\z)/m)
  const block = nested
    ? nested[1]
    : (() => {
        const afterToc = yml.split(/\ntoc:\s*\n/)[1]
        if (!afterToc) throw new Error('myst.yml: missing toc: block')
        return afterToc.split(/\n(?=[a-z])/)[0] || afterToc
      })()
  const files = []
  const re = /-\s*file:\s*(\S+)/g
  let m
  while ((m = re.exec(block)) !== null) files.push(m[1].trim())
  if (files.length === 0) throw new Error('myst.yml: no toc file: entries')
  return files
}

function titleFromMd(content) {
  const fm = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const h = fm.match(/^#\s+(.+)$/m)
  return h ? h[1].trim() : 'Page'
}

function safeId(s) {
  return String(s)
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const name of fs.readdirSync(from)) {
    const f = path.join(from, name)
    const t = path.join(to, name)
    if (fs.statSync(f).isDirectory()) copyRecursive(f, t)
    else fs.copyFileSync(f, t)
  }
}

function writeAggregateManifest({ tocFiles, resources, items }) {
  const orgItems = items
    .map(
      (it) => `      <item identifier="${it.itemId}" identifierref="${it.ref}">
        <title>${escapeXml(it.title)}</title>
      </item>`,
    )
    .join('\n')

  const resourceBlocks = resources
    .map(
      (r) => `    <resource identifier="${r.id}" type="webcontent" href="${r.href}">
      <file href="${r.href}" />
    </resource>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest
  identifier="manifest_aima_myst_imscc"
  xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1"
  xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/imscp_v1p2.xsd"
>
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.1.0</schemaversion>
  </metadata>
  <organizations>
    <organization identifier="O_AIMA_MYST" structure="rooted-hierarchy">
      <title>AIMA 5001 — from MyST demo sources</title>
${orgItems}
    </organization>
  </organizations>
  <resources>
${resourceBlocks}
  </resources>
</manifest>
`
}

function buildVariantCartridge(v) {
  const dir = path.join(root, 'demos', 'aima-imscc-variant-staging', v.repo)
  const wr = path.join(dir, 'web_resources')
  fs.mkdirSync(wr, { recursive: true })

  const srcMd = path.join(mystRoot, v.sourceFile)
  if (!fs.existsSync(srcMd)) {
    throw new Error(`Variant ${v.repo}: missing ${v.sourceFile}`)
  }
  fs.copyFileSync(srcMd, path.join(wr, v.sourceFile))
  fs.copyFileSync(pdfSource, path.join(wr, 'week1-search-slides.pdf'))

  const body = fs.readFileSync(srcMd, 'utf8')
  const pageTitle = titleFromMd(body)
  const mdHref = `web_resources/${v.sourceFile.replace(/\\/g, '/')}`
  const pdfHref = 'web_resources/week1-search-slides.pdf'

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest
  identifier="manifest_${v.repo}_imscc"
  xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1"
  xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/imscp_v1p2.xsd"
>
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.1.0</schemaversion>
  </metadata>
  <organizations>
    <organization identifier="O_${safeId(v.repo)}" structure="rooted-hierarchy">
      <title>${escapeXml(v.projectTitle)} — LMS import</title>
      <item identifier="ITEM_page" identifierref="R_page">
        <title>${escapeXml(pageTitle)}</title>
      </item>
      <item identifier="ITEM_pdf" identifierref="R_pdf">
        <title>Week 1 search slides (PDF)</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="R_page" type="webcontent" href="${mdHref}">
      <file href="${mdHref}" />
    </resource>
    <resource identifier="R_pdf" type="webcontent" href="${pdfHref}">
      <file href="${pdfHref}" />
    </resource>
  </resources>
</manifest>
`
  fs.writeFileSync(path.join(dir, 'imsmanifest.xml'), manifest, 'utf8')

  const zipName = `${v.repo}-lms-demo.imscc`
  const zipPath = path.join(outDir, zipName)
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
  execFileSync('zip', ['-q', '-r', zipPath, '.'], { cwd: dir })

  const pubDest = path.join(unpackedRoot, v.repo)
  fs.rmSync(pubDest, { recursive: true, force: true })
  copyRecursive(dir, pubDest)

  fs.rmSync(dir, { recursive: true, force: true })

  console.log(`[build-imscc-from-myst-sources] variant ${v.repo} → ${path.relative(root, zipPath)}`)
}

function main() {
  if (!fs.existsSync(mystYmlPath)) {
    console.error(`[build-imscc-from-myst-sources] missing ${mystYmlPath}`)
    process.exit(1)
  }
  if (!fs.existsSync(pdfSource)) {
    console.error(`[build-imscc-from-myst-sources] missing PDF: ${pdfSource}`)
    process.exit(1)
  }

  const yml = fs.readFileSync(mystYmlPath, 'utf8')
  const tocFiles = parseMystToc(yml)

  fs.mkdirSync(webRes, { recursive: true })
  for (const name of fs.readdirSync(webRes)) {
    const p = path.join(webRes, name)
    fs.rmSync(p, { recursive: true, force: true })
  }

  const resources = []
  const items = []

  for (const file of tocFiles) {
    const src = path.join(mystRoot, file)
    if (!fs.existsSync(src)) {
      throw new Error(`TOC lists missing file: ${file}`)
    }
    const destRel = file.replace(/\\/g, '/')
    const destAbs = path.join(webRes, file)
    fs.mkdirSync(path.dirname(destAbs), { recursive: true })
    fs.copyFileSync(src, destAbs)

    const body = fs.readFileSync(src, 'utf8')
    const title = titleFromMd(body)
    const rid = `R_${safeId(file)}`
    const href = `web_resources/${destRel}`
    resources.push({ id: rid, href, file: destRel })
    items.push({
      itemId: `ITEM_${safeId(file)}`,
      ref: rid,
      title,
    })
  }

  fs.copyFileSync(pdfSource, path.join(webRes, 'week1-search-slides.pdf'))
  resources.push({
    id: 'R_week1_pdf',
    href: 'web_resources/week1-search-slides.pdf',
    file: 'week1-search-slides.pdf',
  })
  items.push({
    itemId: 'ITEM_week1_pdf',
    ref: 'R_week1_pdf',
    title: 'Week 1 search slides (PDF)',
  })

  fs.writeFileSync(
    path.join(imsccSrc, 'imsmanifest.xml'),
    writeAggregateManifest({ tocFiles, resources, items }),
    'utf8',
  )

  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'aima-lms-demo.imscc')
  if (fs.existsSync(outFile)) fs.unlinkSync(outFile)
  execFileSync('zip', ['-q', '-r', outFile, '.'], { cwd: imsccSrc })

  const aggregateUnpacked = path.join(unpackedRoot, 'aima-lms-demo')
  fs.rmSync(aggregateUnpacked, { recursive: true, force: true })
  copyRecursive(imsccSrc, aggregateUnpacked)

  console.log(
    `[build-imscc-from-myst-sources] full course ${tocFiles.length} pages + PDF → ${path.relative(root, outFile)}`,
  )

  fs.rmSync(path.join(root, 'demos', 'aima-imscc-variant-staging'), { recursive: true, force: true })

  for (const v of AIMA_VARIANT_REPOS) {
    buildVariantCartridge(v)
  }

  const stagingParent = path.join(root, 'demos', 'aima-imscc-variant-staging')
  if (fs.existsSync(stagingParent)) {
    fs.rmSync(stagingParent, { recursive: true, force: true })
  }

  console.log(`[build-imscc-from-myst-sources] unpacked → ${path.relative(root, unpackedRoot)}/<variant>`)
}

main()

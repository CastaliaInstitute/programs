/**
 * Builds a thin IMS Common Cartridge (.imscc is a zip) for AIMA LMS import.
 * Pulls the week-1 PDF from aima-demo-content so the cartridge matches the public PDF demo.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'demos', 'aima-imscc-src')
const pdfSource = path.join(root, 'demos', 'aima-demo-content', 'week1-search-slides.pdf')
const pdfDest = path.join(src, 'web_resources', 'week1-search-slides.pdf')
const outDir = path.join(root, 'public', 'demos')
const outFile = path.join(outDir, 'aima-lms-demo.imscc')

fs.mkdirSync(path.join(src, 'web_resources'), { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

if (!fs.existsSync(pdfSource)) {
  console.error(`[zip-aima-imscc] missing PDF source: ${pdfSource}`)
  process.exit(1)
}
fs.copyFileSync(pdfSource, pdfDest)

if (fs.existsSync(outFile)) fs.unlinkSync(outFile)

execFileSync('zip', ['-q', '-r', outFile, '.'], { cwd: src })
console.log(`[zip-aima-imscc] wrote ${path.relative(root, outFile)}`)

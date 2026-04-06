/**
 * Copies sample AIMA PDFs into public/demos for static download links on the catalog.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const srcDir = path.join(root, 'demos', 'aima-demo-content')
const outDir = path.join(root, 'public', 'demos')

fs.mkdirSync(outDir, { recursive: true })
let n = 0
for (const name of fs.readdirSync(srcDir)) {
  if (!name.toLowerCase().endsWith('.pdf')) continue
  fs.copyFileSync(path.join(srcDir, name), path.join(outDir, name))
  n += 1
}
console.log(`[copy-aima-demo-pdfs] copied ${n} PDF(s) to ${path.relative(root, outDir)}`)

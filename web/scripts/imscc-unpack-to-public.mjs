/**
 * Copies the IMS CC source tree to public/ so GitHub Pages can serve the same
 * content as the .imscc zip—used by /catalog/imscc-viewer.
 * Run after zip-aima-imscc.mjs so web_resources includes the synced PDF.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'demos', 'aima-imscc-src')
const dest = path.join(root, 'public', 'demos', 'imscc-unpacked', 'aima-lms-demo')

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const name of fs.readdirSync(from)) {
    const f = path.join(from, name)
    const t = path.join(to, name)
    if (fs.statSync(f).isDirectory()) copyRecursive(f, t)
    else fs.copyFileSync(f, t)
  }
}

if (!fs.existsSync(src)) {
  console.error(`[imscc-unpack-to-public] missing source: ${src}`)
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
copyRecursive(src, dest)
console.log(`[imscc-unpack-to-public] copied to ${path.relative(root, dest)}`)

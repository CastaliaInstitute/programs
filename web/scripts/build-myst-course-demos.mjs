/**
 * Builds one MyST site for all AIMA 5001 demo courses: web/myst-sources/ain2001/
 * Copies _build/html → public/demos/myst/ain2001/
 *
 * Per-variant sources: basic.md, ai-delivery.md, … → routes /basic/, /ai-delivery/, …
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.join(__dirname, '..')
const MYST_BIN = path.join(WEB_ROOT, 'node_modules', '.bin', 'myst')
const PROJECT = 'ain2001'
const BASE_PATH = `/demos/myst/${PROJECT}/`

function main() {
  if (!existsSync(MYST_BIN)) {
    console.warn('[build-myst-course-demos] myst CLI not found; skip (run npm install)')
    process.exit(0)
  }

  const cwd = path.join(WEB_ROOT, 'myst-sources', PROJECT)
  if (!existsSync(path.join(cwd, 'myst.yml'))) {
    throw new Error(`Missing myst project at ${cwd}`)
  }

  if (existsSync(path.join(cwd, '_build'))) {
    rmSync(path.join(cwd, '_build'), { recursive: true, force: true })
  }

  execSync(`"${MYST_BIN}" build --html --ci`, {
    cwd,
    env: {
      ...process.env,
      CI: 'true',
      BASE_URL: BASE_PATH,
    },
    stdio: 'inherit',
  })

  const built = path.join(cwd, '_build', 'html', 'index.html')
  if (!existsSync(built)) {
    throw new Error(`myst did not produce ${built}`)
  }

  const outDir = path.join(WEB_ROOT, 'public', 'demos', 'myst', PROJECT)
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(path.dirname(outDir), { recursive: true })
  cpSync(path.join(cwd, '_build', 'html'), outDir, { recursive: true })

  console.log(`[build-myst-course-demos] ${PROJECT} → public/demos/myst/${PROJECT}/`)
}

main()

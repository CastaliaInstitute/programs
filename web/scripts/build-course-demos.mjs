/**
 * Builds one static course-demo site for all AIMA 5001 variants: web/demo-sources/ain2001/
 * Copies _build/html → public/demos/course/ain2001/
 *
 * Per-variant sources: basic.md, ai-delivery.md, … → routes /basic/, /ai-delivery/, …
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.join(__dirname, '..')
const BUILD_CLI = path.join(WEB_ROOT, 'node_modules', '.bin', 'myst')
const PROJECT = 'ain2001'
const BASE_PATH = `/demos/course/${PROJECT}/`

function main() {
  if (!existsSync(BUILD_CLI)) {
    console.warn('[build-course-demos] static site CLI not found; skip (run npm install)')
    process.exit(0)
  }

  const cwd = path.join(WEB_ROOT, 'demo-sources', PROJECT)
  if (!existsSync(path.join(cwd, 'myst.yml'))) {
    throw new Error(`Missing project config at ${cwd}`)
  }

  if (existsSync(path.join(cwd, '_build'))) {
    rmSync(path.join(cwd, '_build'), { recursive: true, force: true })
  }

  execSync(`"${BUILD_CLI}" build --html --ci`, {
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
    throw new Error(`Build did not produce ${built}`)
  }

  const outDir = path.join(WEB_ROOT, 'public', 'demos', 'course', PROJECT)
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(path.dirname(outDir), { recursive: true })
  cpSync(path.join(cwd, '_build', 'html'), outDir, { recursive: true })

  console.log(`[build-course-demos] ${PROJECT} → public/demos/course/${PROJECT}/`)
}

main()

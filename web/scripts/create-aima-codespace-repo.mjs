#!/usr/bin/env node
/**
 * Scaffold the InquiryInstitute/aima-codespace template: devcontainer, pytest exercises, CI.
 * Students fork and rename to aima-<username>, then open in GitHub Codespaces.
 *
 * Usage:
 *   node scripts/create-aima-codespace-repo.mjs [--out DIR] [--org ORG] [--dry-run] [--push]
 *
 * --dry-run   Copy template to --out without npm/git (default out: ../.aima-variant-repos/aima-codespace)
 * --push      git init, commit, gh repo create ORG/aima-codespace --public --push
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.join(__dirname, '..')
const TEMPLATE_ROOT = path.join(__dirname, 'aima-codespace-repo')

function parseArgs(argv) {
  let outDir = path.join(WEB_ROOT, '..', '.aima-variant-repos')
  let org = 'InquiryInstitute'
  let dryRun = false
  let push = false
  for (const a of argv) {
    if (a === '--dry-run') dryRun = true
    else if (a === '--push') push = true
    else if (a.startsWith('--out=')) outDir = path.resolve(a.slice('--out='.length))
    else if (a.startsWith('--org=')) org = a.slice('--org='.length)
  }
  return { outDir, org, dryRun, push }
}

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const name of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, name.name)
    const dest = path.join(to, name.name)
    if (name.name === '.git') continue
    if (name.isDirectory()) copyRecursive(src, dest)
    else fs.copyFileSync(src, dest)
  }
}

function gitPushScaffold({ repoRoot, org, repo, dryRun }) {
  if (dryRun) {
    console.log(`[create-aima-codespace-repo] --dry-run: skip git/gh for ${repo}`)
    return
  }
  execSync('git init -b main', { cwd: repoRoot, stdio: 'inherit' })
  execSync('git add -A', { cwd: repoRoot, stdio: 'inherit' })
  execSync(
    `git -c user.email="noreply@github.com" -c user.name="aima-codespace-scaffold" commit -m "Scaffold aima-codespace student template (devcontainer + exercises)"`,
    { cwd: repoRoot, stdio: 'inherit' },
  )
  let exists = false
  try {
    execSync(`gh repo view ${org}/${repo}`, { stdio: 'pipe' })
    exists = true
  } catch {
    exists = false
  }
  if (exists) {
    console.warn(
      `[create-aima-codespace-repo] ${org}/${repo} already exists — skipped gh repo create. Add remote and push from ${repoRoot}`,
    )
    return
  }
  execSync(
    `gh repo create ${org}/${repo} --public --description "AIMA 5001 — fork as aima-<username>; Codespaces + Python exercises" --source=. --remote=origin --push`,
    { cwd: repoRoot, stdio: 'inherit' },
  )
}

function main() {
  const { outDir, org, dryRun, push } = parseArgs(process.argv.slice(2))
  const repo = 'aima-codespace'
  const repoRoot = path.join(outDir, repo)

  if (!fs.existsSync(TEMPLATE_ROOT)) {
    console.error(`Missing template directory: ${TEMPLATE_ROOT}`)
    process.exit(1)
  }

  fs.mkdirSync(outDir, { recursive: true })
  if (fs.existsSync(repoRoot)) {
    fs.rmSync(repoRoot, { recursive: true, force: true })
  }
  copyRecursive(TEMPLATE_ROOT, repoRoot)

  console.log(`[create-aima-codespace-repo] wrote ${repoRoot}`)

  if (!dryRun) {
    try {
      execSync('python3 -m pip install -q -r requirements.txt', { cwd: repoRoot, stdio: 'inherit' })
      execSync('python3 -m pytest exercises -q', { cwd: repoRoot, stdio: 'inherit' })
    } catch (e) {
      console.error('[create-aima-codespace-repo] pytest failed; fix template before --push')
      process.exit(1)
    }
  }

  if (push) {
    gitPushScaffold({ repoRoot, org, repo, dryRun })
  } else if (!dryRun) {
    console.log('\nScaffold complete. Commit and push, or re-run with --push (requires gh auth).')
  }
}

main()

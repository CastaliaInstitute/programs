#!/usr/bin/env node
/**
 * Scaffold standalone Git repositories for each AIMA 5001 delivery variant from MyST sources
 * (web/myst-sources/ain2001/*.md). Each repo is a single-page MyST book-theme site with
 * GitHub Actions → GitHub Pages.
 *
 * Usage:
 *   node scripts/create-aima-variant-repos.mjs [--out DIR] [--org ORG] [--dry-run] [--push] [--only aima-basic]
 *
 * --dry-run   Write repos under --out without gh/git push (default out: ../.aima-variant-repos)
 * --push      After scaffold: git init, commit, gh repo create ORG/REPO --public --push
 *             (requires gh auth; skips if repo exists)
 *
 * Generated site URL pattern: https://ORG.github.io/REPO/
 */
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { AIMA_VARIANT_REPOS } from './aima-variant-repos.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.join(__dirname, '..')
const MYST_ROOT = path.join(WEB_ROOT, 'myst-sources', 'ain2001')

function parseArgs(argv) {
  let outDir = path.join(WEB_ROOT, '..', '.aima-variant-repos')
  let org = 'InquiryInstitute'
  let dryRun = false
  let push = false
  let only = null
  for (const a of argv) {
    if (a === '--dry-run') dryRun = true
    else if (a === '--push') push = true
    else if (a.startsWith('--out=')) outDir = path.resolve(a.slice('--out='.length))
    else if (a.startsWith('--org=')) org = a.slice('--org='.length)
    else if (a.startsWith('--only=')) only = a.slice('--only='.length)
  }
  return { outDir, org, dryRun, push, only }
}

/** Adjust copy that referenced the monorepo programs site paths for standalone GitHub Pages */
function adaptMarkdownForStandaloneRepo(body, { org, repo, pagesUrl }) {
  let s = body
  s = s.replace(
    /`web\/myst-sources\/ain2001\/[^`]+`/g,
    '`index.md` in this repository',
  )
  s = s.replace(
    /\/demos\/week1-search-slides\.pdf/g,
    'https://programs.castalia.institute/demos/week1-search-slides.pdf',
  )
  s = s.replace(
    /when you run `npm run build:demos`/g,
    'when you run `npm run build` in this repository',
  )
  s = s.replace(
    /published under `\/demos\/myst\/ain2001\/[^`]+`/g,
    `published at ${pagesUrl}`,
  )
  s = s.replace(
    /→ `\/demos\/myst\/ain2001\/[^`]+`/g,
    `→ ${pagesUrl}`,
  )
  return s
}

function writePagesWorkflow(repoRoot) {
  const yml = [
    'name: Deploy Pages',
    '',
    'on:',
    '  push:',
    '    branches: [main]',
    '  workflow_dispatch:',
    '',
    'permissions:',
    '  contents: read',
    '  pages: write',
    '  id-token: write',
    '',
    'concurrency:',
    '  group: pages',
    '  cancel-in-progress: true',
    '',
    'jobs:',
    '  build:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - uses: actions/setup-node@v4',
    '        with:',
    '          node-version: 22',
    '          cache: npm',
    '      - name: Install',
    '        run: npm ci',
    '      - name: Build MyST site',
    '        env:',
    "          CI: 'true'",
    '          BASE_URL: /${{ github.event.repository.name }}/',
    '        run: npx myst build --html --ci',
    '      - uses: actions/upload-pages-artifact@v3',
    '        with:',
    '          path: _build/html',
    '',
    '  deploy:',
    '    needs: build',
    '    runs-on: ubuntu-latest',
    '    environment:',
    '      name: github-pages',
    '      url: ${{ steps.deployment.outputs.page_url }}',
    '    steps:',
    '      - id: deployment',
    '        uses: actions/deploy-pages@v4',
    '',
  ].join('\n')

  const wf = path.join(repoRoot, '.github', 'workflows')
  mkdirSync(wf, { recursive: true })
  writeFileSync(path.join(wf, 'pages.yml'), yml)
}

function scaffoldOne(variant, { outDir, org, dryRun }) {
  const { repo, sourceFile, packageName, projectTitle, description } = variant
  const repoRoot = path.join(outDir, repo)
  const pagesUrl = `https://${org}.github.io/${repo}/`

  if (existsSync(repoRoot)) {
    rmSync(repoRoot, { recursive: true, force: true })
  }
  mkdirSync(repoRoot, { recursive: true })

  const srcPath = path.join(MYST_ROOT, sourceFile)
  if (!existsSync(srcPath)) {
    throw new Error(`Missing MyST source: ${srcPath}`)
  }
  let md = readFileSync(srcPath, 'utf8')
  md = adaptMarkdownForStandaloneRepo(md, { org, repo, pagesUrl })

  const mystYml = `# See https://mystmd.org/guide/frontmatter
version: 1
project:
  id: ${randomUUID()}
  title: ${JSON.stringify(projectTitle)}
  toc:
    - file: index.md
site:
  template: book-theme
`
  writeFileSync(path.join(repoRoot, 'myst.yml'), mystYml)
  writeFileSync(path.join(repoRoot, 'index.md'), md)

  const pkg = {
    name: packageName,
    version: '1.0.0',
    private: true,
    description,
    scripts: {
      build: 'myst build --html --ci',
    },
    devDependencies: {
      mystmd: '^1.8.3',
    },
  }
  writeFileSync(path.join(repoRoot, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

  writeFileSync(
    path.join(repoRoot, '.gitignore'),
    `node_modules/
_build/
.DS_Store
`,
  )

  writePagesWorkflow(repoRoot)

  const readme = `# ${projectTitle}

${description}

- **MyST source:** \`index.md\` (generated from [programs](https://github.com/${org}/programs) \`myst-sources/ain2001/${sourceFile}\`).
- **Live site (after Pages):** ${pagesUrl}

## Build locally

\`\`\`bash
npm install
BASE_URL=/ npm run build
\`\`\`

Static output is in \`_build/html/\`. For GitHub Pages, \`BASE_URL\` is set to \`/<repo>/\` in Actions.

## License

Content policy matches the parent AIMA / Castalia programs licensing workflow.
`
  writeFileSync(path.join(repoRoot, 'README.md'), readme)

  if (!dryRun) {
    execSync('npm install', { cwd: repoRoot, stdio: 'inherit' })
  }

  console.log(`[create-aima-variant-repos] wrote ${repoRoot}`)
  return { repoRoot, repo, pagesUrl }
}

function gitPushScaffold({ repoRoot, org, repo, dryRun }) {
  if (dryRun) {
    console.log(`[create-aima-variant-repos] --dry-run: skip git/gh for ${repo}`)
    return
  }
  execSync('git init -b main', { cwd: repoRoot, stdio: 'inherit' })
  execSync('git add -A', { cwd: repoRoot, stdio: 'inherit' })
  execSync(
    `git -c user.email="noreply@github.com" -c user.name="aima-variant-scaffold" commit -m "Scaffold MyST site for ${repo}"`,
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
      `[create-aima-variant-repos] ${org}/${repo} already exists — skipped gh repo create. Add remote and push from ${repoRoot}`,
    )
    return
  }
  execSync(
    `gh repo create ${org}/${repo} --public --description "AIMA5001 ${repo} — MyST + GitHub Pages" --source=. --remote=origin --push`,
    { cwd: repoRoot, stdio: 'inherit' },
  )
}

function main() {
  const { outDir, org, dryRun, push, only } = parseArgs(process.argv.slice(2))
  mkdirSync(outDir, { recursive: true })

  const variants = only
    ? AIMA_VARIANT_REPOS.filter((v) => v.repo === only)
    : AIMA_VARIANT_REPOS

  if (variants.length === 0) {
    console.error(`No variant matched --only=${only}`)
    process.exit(1)
  }

  console.log(`Output directory: ${outDir}`)
  console.log(`Organization: ${org}`)
  console.log(`Variants: ${variants.map((v) => v.repo).join(', ')}`)

  for (const v of variants) {
    const meta = scaffoldOne(v, { outDir, org, dryRun })
    if (push) {
      gitPushScaffold({ ...meta, org, dryRun })
    }
  }

  if (dryRun) {
    console.log('\nDry run complete. Inspect folders, then run with --push to create/push repos (requires gh).')
  } else if (!push) {
    console.log('\nScaffold complete. Commit and push each folder, or re-run with --push to use gh repo create.')
  }
}

main()

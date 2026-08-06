#!/usr/bin/env node
/**
 * Operator bootstrap — provisions Castalia's platform infrastructure via API so setup is one
 * command, not a manual checklist. Idempotent: safe to re-run. CUSTOMERS never run this and never
 * configure anything — individuals OAuth-connect, institutions click Install. This is Castalia's
 * one-time operator setup only.
 *
 * Credentials (operator, from env — created once, by Castalia):
 *   Cloudflare:  CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
 *   GitHub App:  GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_ID
 *                (create the App once via automation/github-app-manifest.json)
 *
 * Each section no-ops with a clear message when its credentials are absent, so you can run the
 * parts you have. Nothing here is destructive — it creates-if-missing and reports.
 *
 * Usage:  node automation/bootstrap.mjs [--dry-run]
 */
import crypto from 'node:crypto'

const DRY = process.argv.includes('--dry-run')
const PAGES_PROJECT = 'programs-castalia'
const KV_TITLE = 'FULFILLMENT'
const COURSE_ORG = 'CastaliaInstitute'
const TEMPLATE_REPO = 'ains-course-template'

const log = (...a) => console.log('•', ...a)
const have = (...names) => names.every((n) => (process.env[n] ?? '').length > 0)

// ---------------------------------------------------------------------------
// Cloudflare: Pages project + KV namespace + binding
// ---------------------------------------------------------------------------
async function cf(path, init) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const body = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, body }
}

async function bootstrapCloudflare() {
  if (!have('CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID')) {
    log('Cloudflare: skipped (set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID to enable)')
    return
  }
  const acct = process.env.CLOUDFLARE_ACCOUNT_ID

  // KV namespace (idempotent: create only if a namespace with this title is absent).
  const kvList = await cf(`/accounts/${acct}/storage/kv/namespaces?per_page=100`)
  let kv = (kvList.body.result ?? []).find((n) => n.title === KV_TITLE)
  if (!kv) {
    if (DRY) log(`Cloudflare: would create KV namespace ${KV_TITLE}`)
    else {
      const r = await cf(`/accounts/${acct}/storage/kv/namespaces`, { method: 'POST', body: JSON.stringify({ title: KV_TITLE }) })
      kv = r.body.result
      log(r.ok ? `Cloudflare: created KV ${KV_TITLE} (${kv?.id})` : `Cloudflare: KV create failed ${r.status} ${JSON.stringify(r.body.errors)}`)
    }
  } else log(`Cloudflare: KV ${KV_TITLE} exists (${kv.id})`)

  // Pages project (idempotent).
  const proj = await cf(`/accounts/${acct}/pages/projects/${PAGES_PROJECT}`)
  if (proj.status === 404) {
    if (DRY) log(`Cloudflare: would create Pages project ${PAGES_PROJECT}`)
    else {
      const r = await cf(`/accounts/${acct}/pages/projects`, {
        method: 'POST',
        body: JSON.stringify({ name: PAGES_PROJECT, production_branch: 'main' }),
      })
      log(r.ok ? `Cloudflare: created Pages project ${PAGES_PROJECT}` : `Cloudflare: project create failed ${r.status} ${JSON.stringify(r.body.errors)}`)
    }
  } else log(`Cloudflare: Pages project ${PAGES_PROJECT} exists`)

  // NOTE: secrets (Stripe/GitHub/Supabase keys) and the KV binding go on the Pages project's
  // production env; set them with `wrangler pages secret put` or PATCH the project's
  // deployment_configs. NOTE: gating books to enrolled learners is a Cloudflare Access
  // application + policy (/accounts/{acct}/access/apps) — configured per project. Both are
  // documented in AUTOMATION.md; left out here so this script stays create-only and safe.
  log('Cloudflare: set secrets + KV binding + Access policy per AUTOMATION.md (not auto-set here)')
}

// ---------------------------------------------------------------------------
// GitHub App: mint installation token → create the course template repo
// ---------------------------------------------------------------------------
function appJwt() {
  const now = Math.floor(Date.now() / 1000)
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iat: now - 60, exp: now + 540, iss: process.env.GITHUB_APP_ID })}`
  const sig = crypto.sign('RSA-SHA256', Buffer.from(unsigned), process.env.GITHUB_APP_PRIVATE_KEY).toString('base64url')
  return `${unsigned}.${sig}`
}

async function gh(path, token, init) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'user-agent': 'castalia-bootstrap', ...(init?.headers ?? {}) },
  })
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) }
}

async function bootstrapGitHub() {
  if (!have('GITHUB_APP_ID', 'GITHUB_APP_PRIVATE_KEY', 'GITHUB_APP_INSTALLATION_ID')) {
    log('GitHub: skipped (create the App via github-app-manifest.json, then set GITHUB_APP_* )')
    return
  }
  const tok = await gh(`/app/installations/${process.env.GITHUB_APP_INSTALLATION_ID}/access_tokens`, appJwt(), { method: 'POST' })
  if (!tok.ok) return log(`GitHub: installation token failed ${tok.status}`)
  const token = tok.body.token

  // Template repo (idempotent): create as a template if absent.
  const exists = await gh(`/repos/${COURSE_ORG}/${TEMPLATE_REPO}`, token)
  if (exists.status === 404) {
    if (DRY) log(`GitHub: would create template repo ${COURSE_ORG}/${TEMPLATE_REPO}`)
    else {
      const r = await gh(`/orgs/${COURSE_ORG}/repos`, token, {
        method: 'POST',
        body: JSON.stringify({ name: TEMPLATE_REPO, private: true, is_template: true, description: 'Castalia course working template (learner repos generate from this)' }),
      })
      log(r.ok ? `GitHub: created template repo ${COURSE_ORG}/${TEMPLATE_REPO}` : `GitHub: template create failed ${r.status} ${JSON.stringify(r.body)}`)
    }
  } else log(`GitHub: template repo ${COURSE_ORG}/${TEMPLATE_REPO} exists`)

  // NOTE: exam/ path protection (only the App may write the Socratic transcript) is a repo ruleset
  // applied per provisioned repo, not on the template — see the exam-integrity TODO in
  // github-provision.ts.
}

log(DRY ? 'Bootstrap (dry-run)' : 'Bootstrap')
await bootstrapCloudflare()
await bootstrapGitHub()
log('Done.')

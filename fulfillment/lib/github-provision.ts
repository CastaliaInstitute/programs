/**
 * Create a buyer's course repository from a template, as the Castalia GitHub App, and write the
 * feature manifest that turns on inqspace + Dialogic/BEATRICE/SAMWISE.
 *
 * Runs in a Cloudflare Pages Function (Workers runtime) — uses fetch + Web Crypto only, no Node
 * built-ins.
 */
import type { CourseProvisionConfig } from './course-catalog'

export interface GitHubAppEnv {
  GITHUB_APP_ID: string
  /** PEM private key for the GitHub App. Stored as a Cloudflare secret. */
  GITHUB_APP_PRIVATE_KEY: string
  /**
   * Default org for individual self-serve buyer repos, e.g. "CastaliaInstitute".
   * Institutional purchases override this with the institution's own org.
   */
  GITHUB_STUDENTS_ORG: string
}

export interface ProvisionTarget {
  /** Org the repo is created in. Individual → GITHUB_STUDENTS_ORG; institutional → the buyer's org. */
  org: string
  /** GitHub login to add as a collaborator (the buyer). Optional for institutional (admin manages access). */
  collaborator?: string
}

export interface ProvisionResult {
  repoFullName: string
  repoUrl: string
}

/** Base64url-encode a string (JWT segments). */
function b64url(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Import a PKCS#8 PEM into a Web Crypto RS256 signing key. */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '')
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

/**
 * Resolve the GitHub Organization an App installation belongs to. Used by the institutional
 * connect callback to record the verified org (the one the App was just installed on) rather than
 * trusting a free-text org name.
 */
export async function installationOrg(installationId: string, env: GitHubAppEnv, now: number): Promise<string> {
  const jwt = await appJwt(env, now)
  const res = await fetch(`${GH}/app/installations/${installationId}`, {
    headers: { authorization: `Bearer ${jwt}`, accept: 'application/vnd.github+json', 'user-agent': UA },
  })
  if (!res.ok) throw new Error(`installation lookup failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as { account: { login: string } }).account.login
}

/** Mint a short-lived GitHub App JWT (RS256). `now` is injected for testability. */
async function appJwt(env: GitHubAppEnv, now: number): Promise<string> {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = b64url(
    JSON.stringify({ iat: now - 60, exp: now + 540, iss: env.GITHUB_APP_ID }),
  )
  const key = await importPrivateKey(env.GITHUB_APP_PRIVATE_KEY)
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  )
  const sigB64 = b64url(String.fromCharCode(...new Uint8Array(sig)))
  return `${header}.${payload}.${sigB64}`
}

const GH = 'https://api.github.com'
const UA = 'castalia-course-fulfillment'

/**
 * Resolve the App installation for an org. Every org that installs the Castalia GitHub App —
 * CastaliaInstitute for individual buyers, or an institution's own org (e.g. Aurnova) — has its
 * own installation. This is how one App provisions repos into a buyer's org: the institution
 * installs the App, and we look its installation up by org name here.
 */
async function installationIdForOrg(org: string, jwt: string): Promise<number> {
  const res = await fetch(`${GH}/orgs/${org}/installation`, {
    headers: { authorization: `Bearer ${jwt}`, accept: 'application/vnd.github+json', 'user-agent': UA },
  })
  if (res.status === 404) {
    throw new Error(`GitHub App is not installed on org "${org}" — the institution must install it before provisioning`)
  }
  if (!res.ok) throw new Error(`installation lookup failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as { id: number }).id
}

/** Exchange the App JWT for an installation access token scoped to one org's installation. */
async function installationToken(installationId: number, jwt: string): Promise<string> {
  const res = await fetch(`${GH}/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: { authorization: `Bearer ${jwt}`, accept: 'application/vnd.github+json', 'user-agent': UA },
  })
  if (!res.ok) throw new Error(`installation token failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as { token: string }).token
}

/**
 * Provision a course repo into `target.org`, optionally add a collaborator, and commit the
 * feature manifest. Works for both individual (org = CastaliaInstitute) and institutional
 * (org = the buyer's own org) purchases. `now` is injected so the JWT timestamp is
 * deterministic in tests.
 */
export async function provisionCourseRepo(
  course: CourseProvisionConfig,
  target: ProvisionTarget,
  env: GitHubAppEnv,
  now: number,
): Promise<ProvisionResult> {
  const jwt = await appJwt(env, now)
  const installationId = await installationIdForOrg(target.org, jwt)
  const token = await installationToken(installationId, jwt)
  const auth = { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'user-agent': UA }

  const suffix = target.collaborator ? target.collaborator.toLowerCase() : 'cohort'
  const repoName = `${course.code.toLowerCase()}-${suffix}`

  // 1. Generate the repo from the course template into the target org.
  const gen = await fetch(`${GH}/repos/${course.templateRepo}/generate`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({
      owner: target.org,
      name: repoName,
      private: true,
      include_all_branches: false,
    }),
  })
  if (!gen.ok) throw new Error(`generate failed: ${gen.status} ${await gen.text()}`)
  const repo = (await gen.json()) as { full_name: string; html_url: string }

  // 2. Invite the buyer as a collaborator (individual purchase; institutional admins manage access).
  if (target.collaborator) {
    await fetch(`${GH}/repos/${repo.full_name}/collaborators/${target.collaborator}`, {
      method: 'PUT',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ permission: 'push' }),
    })
  }

  // 3. Commit the feature manifest that enables inqspace + Dialogic/BEATRICE/SAMWISE.
  const manifest = {
    course: course.code,
    features: course.features,
  }
  const content = btoa(`${JSON.stringify(manifest, null, 2)}\n`)
  await fetch(`${GH}/repos/${repo.full_name}/contents/castalia-course.json`, {
    method: 'PUT',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'Enable Castalia course features', content }),
  })

  return { repoFullName: repo.full_name, repoUrl: repo.html_url }
}

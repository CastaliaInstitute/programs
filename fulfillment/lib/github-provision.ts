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
  GITHUB_APP_INSTALLATION_ID: string
  /** Org the buyer repos are created under, e.g. "InquiryInstitute". */
  GITHUB_COURSE_ORG: string
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

/** Exchange the App JWT for an installation access token. */
async function installationToken(env: GitHubAppEnv, jwt: string): Promise<string> {
  const res = await fetch(
    `${GH}/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${jwt}`, accept: 'application/vnd.github+json', 'user-agent': UA },
    },
  )
  if (!res.ok) throw new Error(`installation token failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as { token: string }).token
}

/**
 * Provision the buyer's repo: generate from template, add them as a collaborator, and commit the
 * feature manifest. `now` is injected so the JWT timestamp is deterministic in tests.
 */
export async function provisionCourseRepo(
  course: CourseProvisionConfig,
  buyerGitHubHandle: string,
  env: GitHubAppEnv,
  now: number,
): Promise<ProvisionResult> {
  const jwt = await appJwt(env, now)
  const token = await installationToken(env, jwt)
  const auth = { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'user-agent': UA }

  const repoName = `${course.code.toLowerCase()}-${buyerGitHubHandle.toLowerCase()}`

  // 1. Generate the repo from the course template.
  const gen = await fetch(`${GH}/repos/${course.templateRepo}/generate`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({
      owner: env.GITHUB_COURSE_ORG,
      name: repoName,
      private: true,
      include_all_branches: false,
    }),
  })
  if (!gen.ok) throw new Error(`generate failed: ${gen.status} ${await gen.text()}`)
  const repo = (await gen.json()) as { full_name: string; html_url: string }

  // 2. Invite the buyer as a collaborator.
  await fetch(`${GH}/repos/${repo.full_name}/collaborators/${buyerGitHubHandle}`, {
    method: 'PUT',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ permission: 'push' }),
  })

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

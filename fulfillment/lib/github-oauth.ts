/**
 * GitHub "connect" — user authorization via the Castalia GitHub App's OAuth flow.
 *
 * The buyer connects GitHub during onboarding AND before purchase, so we hold a verified GitHub
 * identity (and, for institutional buyers, can confirm the App is installed on their org) before
 * any money moves. This replaces guessing a handle from a Stripe custom field.
 */

export interface GitHubOAuthEnv {
  GITHUB_APP_CLIENT_ID: string
  GITHUB_APP_CLIENT_SECRET: string
  /** e.g. https://programs.castalia.institute/api/github/callback */
  GITHUB_OAUTH_REDIRECT_URI: string
  /** The GitHub App's public slug, for the org-installation flow (institutional connect). */
  GITHUB_APP_SLUG: string
}

export interface ConnectedIdentity {
  login: string
  id: number
  /** Orgs the user belongs to — used to offer institutional provisioning targets. */
  orgs: string[]
}

/**
 * Individual connect: send the user to GitHub to authorize their personal account.
 * `state` is a CSRF/session token.
 */
export function authorizeUrl(env: GitHubOAuthEnv, state: string): string {
  const p = new URLSearchParams({
    client_id: env.GITHUB_APP_CLIENT_ID,
    redirect_uri: env.GITHUB_OAUTH_REDIRECT_URI,
    state,
  })
  return `https://github.com/login/oauth/authorize?${p.toString()}`
}

/**
 * Institutional connect: send the org admin to **install the Castalia App on their GitHub
 * Organization**. Installing on the org is the hard prerequisite for provisioning course repos
 * into it; on completion GitHub redirects to the callback with `installation_id` and
 * `setup_action=install`.
 */
export function appInstallUrl(env: GitHubOAuthEnv, state: string): string {
  const p = new URLSearchParams({ state })
  return `https://github.com/apps/${env.GITHUB_APP_SLUG}/installations/new?${p.toString()}`
}

/** Exchange the OAuth `code` for a user access token. */
export async function exchangeCode(env: GitHubOAuthEnv, code: string): Promise<string> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_APP_CLIENT_ID,
      client_secret: env.GITHUB_APP_CLIENT_SECRET,
      code,
      redirect_uri: env.GITHUB_OAUTH_REDIRECT_URI,
    }),
  })
  const data = (await res.json()) as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(`oauth exchange failed: ${data.error ?? res.status}`)
  return data.access_token
}

/** Identify the connected user and the orgs they belong to. */
export async function identify(userToken: string): Promise<ConnectedIdentity> {
  const h = { authorization: `Bearer ${userToken}`, accept: 'application/vnd.github+json', 'user-agent': 'castalia-course-fulfillment' }
  const me = (await (await fetch('https://api.github.com/user', { headers: h })).json()) as { login: string; id: number }
  const orgs = (await (await fetch('https://api.github.com/user/orgs', { headers: h })).json()) as Array<{ login: string }>
  return { login: me.login, id: me.id, orgs: Array.isArray(orgs) ? orgs.map((o) => o.login) : [] }
}

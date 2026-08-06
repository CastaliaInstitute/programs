/**
 * Cloudflare Pages Function: GET /api/github/callback
 *
 * GitHub OAuth redirect target for the "connect" flow (onboarding and pre-purchase). Exchanges
 * the code for a user token, identifies the buyer + their orgs, and stores the connection in
 * Supabase so checkout can proceed with a verified GitHub identity.
 */
import { exchangeCode, identify, type GitHubOAuthEnv } from '../../../fulfillment/lib/github-oauth'
import { installationOrg, type GitHubAppEnv } from '../../../fulfillment/lib/github-provision'

interface Env extends GitHubOAuthEnv, GitHubAppEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  /** Where to send the user after a successful connect (back to onboarding or checkout). */
  CONNECT_RETURN_URL: string
  FULFILLMENT: KVNamespace
}

async function saveConnection(env: Env, row: Record<string, unknown>): Promise<void> {
  await fetch(`${env.SUPABASE_URL}/rest/v1/github_connections`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'content-type': 'application/json',
      prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
  })
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const state = url.searchParams.get('state')
  if (!state) return new Response('missing state', { status: 400 })

  // Validate state (CSRF) and recover the connect type issued in /api/github/connect.
  const kind = await env.FULFILLMENT.get(`oauth_state:${state}`)
  if (!kind) return new Response('invalid or expired state', { status: 400 })
  await env.FULFILLMENT.delete(`oauth_state:${state}`)

  const to = new URL(env.CONNECT_RETURN_URL)

  if (kind === 'institutional' || url.searchParams.get('setup_action') === 'install') {
    // Institutional: the App was installed on a GitHub Organization. Resolve and record the org.
    const installationId = url.searchParams.get('installation_id')
    if (!installationId) return new Response('missing installation_id', { status: 400 })
    const now = Math.floor(Date.parse(request.headers.get('date') ?? '') / 1000) || 0
    const org = await installationOrg(installationId, env, now)
    await saveConnection(env, { org, installation_id: installationId, connect_state: state, kind: 'institutional' })
    to.searchParams.set('org', org)
    return Response.redirect(to.toString(), 302)
  }

  // Individual: finish user OAuth and record the personal identity + orgs.
  const code = url.searchParams.get('code')
  if (!code) return new Response('missing code', { status: 400 })
  const userToken = await exchangeCode(env, code)
  const identity = await identify(userToken)
  await saveConnection(env, {
    github_login: identity.login,
    github_id: identity.id,
    orgs: identity.orgs,
    connect_state: state,
    kind: 'individual',
  })
  to.searchParams.set('github_login', identity.login)
  return Response.redirect(to.toString(), 302)
}

/**
 * Cloudflare Pages Function: GET /api/github/callback
 *
 * GitHub OAuth redirect target for the "connect" flow (onboarding and pre-purchase). Exchanges
 * the code for a user token, identifies the buyer + their orgs, and stores the connection in
 * Supabase so checkout can proceed with a verified GitHub identity.
 */
import { exchangeCode, identify, type GitHubOAuthEnv } from '../../../fulfillment/lib/github-oauth'

interface Env extends GitHubOAuthEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  /** Where to send the user after a successful connect (back to onboarding or checkout). */
  CONNECT_RETURN_URL: string
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  if (!code || !state) return new Response('missing code/state', { status: 400 })

  // TODO(connect): validate `state` against the value issued in /api/github/connect (CSRF).

  const userToken = await exchangeCode(env, code)
  const identity = await identify(userToken)

  // Persist the connection (do NOT store the raw user token long-term; keep identity + orgs).
  await fetch(`${env.SUPABASE_URL}/rest/v1/github_connections`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'content-type': 'application/json',
      prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      github_login: identity.login,
      github_id: identity.id,
      orgs: identity.orgs,
      connect_state: state,
    }),
  })

  // Carry the verified login forward so checkout can attach it to the Stripe session.
  const to = new URL(env.CONNECT_RETURN_URL)
  to.searchParams.set('github_login', identity.login)
  return Response.redirect(to.toString(), 302)
}

/**
 * Cloudflare Pages Function: GET /api/github/connect
 *
 * Starts the GitHub "connect" flow. Called during onboarding and again before purchase so we
 * always hold a verified GitHub identity before checkout. Issues a state token and redirects the
 * user to GitHub authorization; the callback at /api/github/callback finishes the exchange.
 */
import { authorizeUrl, type GitHubOAuthEnv } from '../../../fulfillment/lib/github-oauth'

interface Env extends GitHubOAuthEnv {
  FULFILLMENT: KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  // Opaque state for CSRF; stored briefly so the callback can validate it.
  const state = crypto.randomUUID()
  await env.FULFILLMENT.put(`oauth_state:${state}`, '1', { expirationTtl: 600 })

  // Preserve where the user should return (onboarding step or checkout) if provided.
  const ret = new URL(request.url).searchParams.get('return')
  if (ret) await env.FULFILLMENT.put(`oauth_return:${state}`, ret, { expirationTtl: 600 })

  return Response.redirect(authorizeUrl(env, state), 302)
}

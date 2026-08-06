/**
 * Cloudflare Pages Function: GET /api/github/connect
 *
 * Starts the GitHub "connect" flow. Called during onboarding and again before purchase so we
 * always hold a verified GitHub identity before checkout. Issues a state token and redirects the
 * user to GitHub authorization; the callback at /api/github/callback finishes the exchange.
 */
import { authorizeUrl, appInstallUrl, type GitHubOAuthEnv } from '../../../fulfillment/lib/github-oauth'

interface Env extends GitHubOAuthEnv {
  FULFILLMENT: KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  // Institutional purchases connect a GitHub ORGANIZATION (install the App on the org);
  // individual purchases connect a personal account (user OAuth).
  const institutional = url.searchParams.get('type') === 'institutional'

  // Opaque state for CSRF; stored briefly so the callback can validate it.
  const state = crypto.randomUUID()
  await env.FULFILLMENT.put(`oauth_state:${state}`, institutional ? 'institutional' : 'individual', {
    expirationTtl: 600,
  })

  // Preserve where the user should return (onboarding step or checkout) if provided.
  const ret = url.searchParams.get('return')
  if (ret) await env.FULFILLMENT.put(`oauth_return:${state}`, ret, { expirationTtl: 600 })

  const dest = institutional ? appInstallUrl(env, state) : authorizeUrl(env, state)
  return Response.redirect(dest, 302)
}

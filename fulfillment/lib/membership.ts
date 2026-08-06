/**
 * Castalia membership check. Castalia courses (the direct / MagAI context) are **free to
 * members** — a $0 checkout that runs the same provisioning flow. Membership is verified
 * server-side at checkout-session creation so the $0 price cannot be forged client-side.
 */

export interface MembershipEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

/**
 * Is this connected GitHub login an active Castalia member? Looks up a `members` table in
 * Supabase (github_login, status). Fails closed (false) on error so a lookup failure never grants
 * a free course.
 */
export async function isCastaliaMember(githubLogin: string, env: MembershipEnv): Promise<boolean> {
  const q = `github_login=eq.${encodeURIComponent(githubLogin)}&status=eq.active&select=github_login`
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/members?${q}`, {
    headers: { apikey: env.SUPABASE_SERVICE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` },
  })
  if (!res.ok) return false
  const rows = (await res.json()) as unknown[]
  return Array.isArray(rows) && rows.length > 0
}

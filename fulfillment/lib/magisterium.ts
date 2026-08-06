/**
 * Magisterium integration — the credentialing boundary.
 *
 * Magisterium owns courses, artifacts (evidence), course_completions (learning lineage), and
 * credentials (Mag.AI etc., via review panels + evaluations). This platform does NOT issue
 * credentials. On course completion it writes the **evidence** into magisterium's schema; the
 * magisterium evaluation process decides whether that earns a credential.
 *
 * Assumes programs shares magisterium's Supabase project (SUPABASE_URL). If they are separate
 * projects, swap these direct writes for POSTs to a magisterium ingest API — the callers don't
 * change.
 */

export interface MagisteriumEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

function sb(env: MagisteriumEnv, path: string): string {
  return `${env.SUPABASE_URL}/rest/v1/${path}`
}
function headers(env: MagisteriumEnv, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: env.SUPABASE_SERVICE_KEY,
    authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'content-type': 'application/json',
    ...extra,
  }
}

/** Ensure an `individuals` row exists for a GitHub login; return its id. */
export async function upsertIndividual(
  env: MagisteriumEnv,
  { githubLogin, fullName, email }: { githubLogin: string; fullName?: string; email?: string },
): Promise<string> {
  const res = await fetch(sb(env, 'individuals'), {
    method: 'POST',
    headers: headers(env, { prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify({
      username: githubLogin,
      full_name: fullName ?? githubLogin,
      email,
      github_url: `https://github.com/${githubLogin}`,
    }),
  })
  if (!res.ok) throw new Error(`upsertIndividual failed: ${res.status} ${await res.text()}`)
  const rows = (await res.json()) as Array<{ id: string }>
  return rows[0].id
}

/** Resolve a magisterium course id by its code (e.g. "AI-103"). */
export async function courseIdByCode(env: MagisteriumEnv, code: string): Promise<string | null> {
  const res = await fetch(sb(env, `courses?code=eq.${encodeURIComponent(code)}&select=id`), {
    headers: headers(env),
  })
  if (!res.ok) return null
  const rows = (await res.json()) as Array<{ id: string }>
  return rows[0]?.id ?? null
}

export interface RepositoryEvidence {
  /** Repo the learner completed the work in. */
  repoUrl: string
  /** Commit the completion evidence is pinned to (tamper-evidence). */
  commitSha: string
  /** Optional content hash / attestation digest recorded in artifact metadata. */
  evidenceDigest?: string
}

/** Record a repository artifact (evidence) for an individual; return the artifact id. */
export async function recordRepositoryArtifact(
  env: MagisteriumEnv,
  individualId: string,
  courseCode: string,
  ev: RepositoryEvidence,
): Promise<string> {
  const res = await fetch(sb(env, 'artifacts'), {
    method: 'POST',
    headers: headers(env, { prefer: 'return=representation' }),
    body: JSON.stringify({
      individual_id: individualId,
      type: 'repository',
      title: `${courseCode} — course work`,
      url: ev.repoUrl,
      metadata: { course_code: courseCode, commit_sha: ev.commitSha, evidence_digest: ev.evidenceDigest ?? null },
    }),
  })
  if (!res.ok) throw new Error(`recordRepositoryArtifact failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as Array<{ id: string }>)[0].id
}

/**
 * Record a course completion (learning lineage) with its evidence artifacts. This is the
 * evidence hand-off; magisterium's evaluation → credential process takes over from here. Does
 * NOT write credentials.
 */
export async function recordCourseCompletion(
  env: MagisteriumEnv,
  { individualId, courseId, artifactIds, grade }: { individualId: string; courseId: string; artifactIds: string[]; grade?: string },
): Promise<void> {
  const res = await fetch(sb(env, 'course_completions'), {
    method: 'POST',
    headers: headers(env, { prefer: 'resolution=merge-duplicates' }),
    body: JSON.stringify({
      individual_id: individualId,
      course_id: courseId,
      completed_at: new Date().toISOString().slice(0, 10),
      artifacts: artifactIds,
      grade,
    }),
  })
  if (!res.ok) throw new Error(`recordCourseCompletion failed: ${res.status} ${await res.text()}`)
}

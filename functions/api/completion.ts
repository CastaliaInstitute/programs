/**
 * Cloudflare Pages Function: POST /api/completion
 *
 * The evidence → completion hand-off. When a course's work is finished (signalled by the course
 * repo's CI/autograder, an instructor, or an AI facilitator), this captures the evidence and
 * writes it into **magisterium** (artifact + course_completion). Magisterium's evaluation and
 * review-panel process decides whether the completion earns a credential (e.g. Mag.AI) — this
 * platform never issues credentials.
 *
 * Auth: a shared secret (COMPLETION_SIGNAL_SECRET) so only trusted signallers can post. Evidence
 * is pinned to a commit SHA (and optional digest) for tamper-evidence.
 *
 * Body: { course_code, github_login, repo_url, commit_sha, evidence_digest?, grade? }
 */
import {
  upsertIndividual,
  courseIdByCode,
  recordRepositoryArtifact,
  recordCourseCompletion,
  type MagisteriumEnv,
} from '../../fulfillment/lib/magisterium'

interface Env extends MagisteriumEnv {
  COMPLETION_SIGNAL_SECRET: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.headers.get('x-completion-secret') !== env.COMPLETION_SIGNAL_SECRET) {
    return new Response('unauthorized', { status: 401 })
  }

  const body = (await request.json()) as {
    course_code?: string
    github_login?: string
    repo_url?: string
    commit_sha?: string
    evidence_digest?: string
    grade?: string
  }
  if (!body.course_code || !body.github_login || !body.repo_url || !body.commit_sha) {
    return new Response('missing course_code, github_login, repo_url, or commit_sha', { status: 400 })
  }

  const courseId = await courseIdByCode(env, body.course_code)
  if (!courseId) return new Response(`unknown course ${body.course_code}`, { status: 404 })

  const individualId = await upsertIndividual(env, { githubLogin: body.github_login })
  const artifactId = await recordRepositoryArtifact(env, individualId, body.course_code, {
    repoUrl: body.repo_url,
    commitSha: body.commit_sha,
    evidenceDigest: body.evidence_digest,
  })
  await recordCourseCompletion(env, { individualId, courseId, artifactIds: [artifactId], grade: body.grade })

  // Completion + evidence recorded. Credential issuance is magisterium's, not ours.
  return Response.json({ ok: true, recorded: { course: body.course_code, artifact: artifactId } })
}

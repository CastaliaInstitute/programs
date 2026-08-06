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
  recordTranscriptArtifact,
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
    // Socratic-defense transcript (written by the App to exam/), pinned + hashed.
    transcript_url?: string
    transcript_sha256?: string
    grade?: string
  }
  if (!body.course_code || !body.github_login || !body.repo_url || !body.commit_sha) {
    return new Response('missing course_code, github_login, repo_url, or commit_sha', { status: 400 })
  }

  const courseId = await courseIdByCode(env, body.course_code)
  if (!courseId) return new Response(`unknown course ${body.course_code}`, { status: 404 })

  const individualId = await upsertIndividual(env, { githubLogin: body.github_login })
  const artifactIds: string[] = []
  artifactIds.push(
    await recordRepositoryArtifact(env, individualId, body.course_code, {
      repoUrl: body.repo_url,
      commitSha: body.commit_sha,
      evidenceDigest: body.evidence_digest,
    }),
  )
  // The Socratic transcript is the credential's tamper-evident core; its SHA-256 is what
  // magisterium binds to the verification_id.
  if (body.transcript_url && body.transcript_sha256) {
    artifactIds.push(
      await recordTranscriptArtifact(env, individualId, body.course_code, {
        transcriptUrl: body.transcript_url,
        commitSha: body.commit_sha,
        transcriptSha256: body.transcript_sha256,
      }),
    )
  }
  await recordCourseCompletion(env, { individualId, courseId, artifactIds, grade: body.grade })

  // Evidence recorded. The magisterium panel evaluates it and issues the verification_id.
  return Response.json({ ok: true, recorded: { course: body.course_code, artifacts: artifactIds } })
}

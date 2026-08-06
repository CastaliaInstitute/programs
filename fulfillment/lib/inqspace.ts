/**
 * inqspace — Castalia's Codespaces-equivalent cloud workspace.
 *
 * This is the ONLY place inqspace-specific logic lives. When the inqspace prototype's
 * provisioning API is located, wire it here; the rest of the fulfillment flow is agnostic to how
 * a workspace is created and only needs the launch URL this returns.
 */

export interface InqspaceLaunch {
  /** URL the buyer opens to enter their cloud workspace for the repo. */
  launchUrl: string
  /** True once a real workspace was provisioned; false while the API is stubbed. */
  provisioned: boolean
}

export interface InqspaceEnv {
  /** Base URL / API host for inqspace, from Cloudflare env. Absent until the prototype is wired. */
  INQSPACE_API_BASE?: string
  INQSPACE_API_TOKEN?: string
}

/**
 * Provision (or link to) an inqspace workspace for a freshly created repo.
 *
 * TODO(inqspace): call the prototype's provisioning API using INQSPACE_API_BASE/TOKEN. Until
 * that exists this returns a deep-link placeholder so the success page and the repo's launch
 * button have a stable target that starts working the moment the API is wired.
 */
export async function launchInqspace(
  repoFullName: string,
  env: InqspaceEnv,
): Promise<InqspaceLaunch> {
  const base = env.INQSPACE_API_BASE?.replace(/\/$/, '')
  if (!base || !env.INQSPACE_API_TOKEN) {
    // Stub: no API configured yet.
    return {
      launchUrl: `https://inqspace.castalia.institute/launch?repo=${encodeURIComponent(repoFullName)}`,
      provisioned: false,
    }
  }

  // TODO(inqspace): replace with the real provisioning request once the prototype is located.
  // const res = await fetch(`${base}/workspaces`, {
  //   method: 'POST',
  //   headers: { authorization: `Bearer ${env.INQSPACE_API_TOKEN}`, 'content-type': 'application/json' },
  //   body: JSON.stringify({ repo: repoFullName }),
  // })
  // const data = await res.json()
  // return { launchUrl: data.launchUrl, provisioned: true }

  return {
    launchUrl: `${base}/launch?repo=${encodeURIComponent(repoFullName)}`,
    provisioned: false,
  }
}

/**
 * Castalia Page Contract — every route should declare metadata compatible with this model.
 * Enforcement lives in middleware + server + gates; metadata is the single vocabulary.
 *
 * **Private-by-default (www):** the Castalia Institute Next app treats unauthenticated users as
 * denied unless the path is on the middleware public allowlist. Prefer `visibility: 'member'`
 * (or stricter) for app pages; use `public` only for routes that are also allowlisted at the edge.
 */
export {};

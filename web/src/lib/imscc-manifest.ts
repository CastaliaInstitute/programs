/** Minimal parser for IMS CC imsmanifest.xml — collects unique <file href="…"> paths. */
export function parseImsccManifestXml(xml: string): { files: string[] } {
  const seen = new Set<string>()
  const files: string[] = []
  const fileRe = /<file\s+href="([^"]+)"/g
  let m
  while ((m = fileRe.exec(xml)) !== null) {
    const p = m[1]
    if (!seen.has(p)) {
      seen.add(p)
      files.push(p)
    }
  }
  return { files }
}

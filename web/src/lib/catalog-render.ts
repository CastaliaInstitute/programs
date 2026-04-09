/** Split `AINS6001 Title…` into code + title for catalog tables. */
export function splitAinsCourseLine(line: string): { code: string; title: string } {
  const m = line.trim().match(/^(AINS\d+)\s+(.+)$/)
  return m ? { code: m[1], title: m[2] } : { code: '—', title: line.trim() }
}

/** First sentence for dense table cells (AIMA variant blurbs). */
export function firstSentence(text: string): string {
  const t = text.trim()
  const i = t.indexOf('. ')
  return i === -1 ? t : t.slice(0, i + 1)
}

/** Skip duplicate AIMA variant list when we render the deliverable demos table. */
export function isAimaVariantBlockTitle(title: string): boolean {
  return title.includes('AIMA 5001') && title.includes('graduate course products')
}

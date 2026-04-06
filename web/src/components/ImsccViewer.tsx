import { useEffect, useState } from 'react'
import type { ImsccViewerFile } from '../lib/imscc-types'

export interface ImsccViewerProps {
  packageLabel: string
  files: ImsccViewerFile[]
}

export default function ImsccViewer({ packageLabel, files }: ImsccViewerProps) {
  const firstPdf = files.find((f) => f.kind === 'pdf')
  const [active, setActive] = useState<ImsccViewerFile | null>(firstPdf ?? files[0] ?? null)
  const [mdText, setMdText] = useState<string | null>(null)
  const [mdError, setMdError] = useState<string | null>(null)

  useEffect(() => {
    if (!active || active.kind !== 'md') {
      setMdText(null)
      setMdError(null)
      return
    }

    let cancelled = false
    setMdText(null)
    setMdError(null)
    ;(async () => {
      try {
        const r = await fetch(active.href)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const t = await r.text()
        if (!cancelled) setMdText(t)
      } catch (e) {
        if (!cancelled) {
          setMdError(e instanceof Error ? e.message : 'Could not load file')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [active])

  function pick(f: ImsccViewerFile) {
    if (f.kind === 'other') {
      window.open(f.href, '_blank', 'noopener,noreferrer')
    }
    setActive(f)
  }

  if (files.length === 0) {
    return (
      <p className="imscc-viewer__empty">
        No files listed in the manifest for {packageLabel}.
      </p>
    )
  }

  return (
    <div className="imscc-viewer">
      <div className="imscc-viewer__toolbar" role="tablist" aria-label={`Files in ${packageLabel}`}>
        {files.map((f) => {
          const isActive = active?.href === f.href
          return (
            <button
              key={f.href}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`imscc-viewer__tab ${isActive ? 'imscc-viewer__tab--active' : ''}`}
              onClick={() => pick(f)}
            >
              <span className="imscc-viewer__tab-name">{f.name}</span>
              <span className="imscc-viewer__tab-kind">{f.kind}</span>
            </button>
          )
        })}
      </div>

      <div className="imscc-viewer__stage">
        {active?.kind === 'pdf' && (
          <iframe title={active.name} className="imscc-viewer__iframe" src={active.href} />
        )}
        {active?.kind === 'md' && (
          <div className="imscc-viewer__md">
            {mdError && <p className="imscc-viewer__md-error">{mdError}</p>}
            {mdText !== null && !mdError && <pre className="imscc-viewer__md-pre">{mdText}</pre>}
            {!mdError && mdText === null && (
              <p className="imscc-viewer__md-loading">Loading…</p>
            )}
          </div>
        )}
        {active?.kind === 'other' && (
          <p className="imscc-viewer__hint">
            Opened <a href={active.href}>{active.name}</a> in a new tab.
          </p>
        )}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { CastaliaSatelliteShell } from '@castalia/platform'

/** Header uses white mark from Inquiry.Institute; footer keeps default `logoSrc` (Castalia) for light backgrounds. */
const INQUIRY_LOGO_WHITE = 'https://inquiry.institute/logo-white.png' as const

export interface ProgramsShellProps {
  children: ReactNode
  isHomePage?: boolean
}

export default function ProgramsShell({ children, isHomePage = false }: ProgramsShellProps) {
  return (
    <CastaliaSatelliteShell
      className="programs-site-root"
      siteId="programs"
      propertyTitle="Programs"
      instituteOrigin="https://castalia.institute"
      logoWhiteSrc={INQUIRY_LOGO_WHITE}
      isHomePage={isHomePage}
    >
      {children}
    </CastaliaSatelliteShell>
  )
}

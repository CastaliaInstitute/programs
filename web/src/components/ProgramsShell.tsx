import type { ReactNode } from 'react'
import { CastaliaSatelliteShell } from '@castalia/platform'

export interface ProgramsShellProps {
  children: ReactNode
  isHomePage?: boolean
}

export default function ProgramsShell({ children, isHomePage = false }: ProgramsShellProps) {
  return (
    <CastaliaSatelliteShell
      siteId="programs"
      propertyTitle="Programs"
      instituteOrigin="https://castalia.institute"
      isHomePage={isHomePage}
    >
      {children}
    </CastaliaSatelliteShell>
  )
}

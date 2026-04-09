import fs from 'node:fs'
import path from 'node:path'
import { parseImsccManifestXml } from './imscc-manifest'
import type { ImsccViewerFile, ImsccViewerFileKind } from './imscc-types'
export type { ImsccViewerFile } from './imscc-types'

export interface ImsccViewerPackage {
  id: string
  label: string
  description: string
  /** Source tree under web/ (manifest + web_resources) */
  sourceDir: string
  /** Served from public after build:demos */
  publicBasePath: string
  manifestFile: string
}

/** Each registered cartridge gets an unpacked tree under public/demos/imscc-unpacked/<id>/. */
export const imsccViewerPackages: ImsccViewerPackage[] = [
  {
    id: 'aima-lms-demo',
    label: 'AIMA — full course (MyST TOC)',
    description:
      'All pages listed in demo-sources/ain2001/myst.yml plus the week-1 PDF—same payload as aima-lms-demo.imscc.',
    sourceDir: 'demos/aima-imscc-src',
    publicBasePath: '/demos/imscc-unpacked/aima-lms-demo',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-basic',
    label: 'AIMA5001 Basic',
    description: 'Variant page (basic.md) plus week-1 PDF—same as aima-basic-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-basic',
    publicBasePath: '/demos/imscc-unpacked/aima-basic',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-delivery',
    label: 'AIMA5001 AI Delivery',
    description: 'Variant page (ai-delivery.md) plus week-1 PDF—same as aima-delivery-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-delivery',
    publicBasePath: '/demos/imscc-unpacked/aima-delivery',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-classroom',
    label: 'AIMA5001 Classroom',
    description: 'Variant page (classroom.md) plus week-1 PDF—same as aima-classroom-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-classroom',
    publicBasePath: '/demos/imscc-unpacked/aima-classroom',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-dialogic',
    label: 'AIMA5001 Dialogic',
    description: 'Variant page (dialogic.md) plus week-1 PDF—same as aima-dialogic-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-dialogic',
    publicBasePath: '/demos/imscc-unpacked/aima-dialogic',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-samwise',
    label: 'AIMA5001 SAMWISE',
    description: 'Variant page (samwise.md) plus week-1 PDF—same as aima-samwise-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-samwise',
    publicBasePath: '/demos/imscc-unpacked/aima-samwise',
    manifestFile: 'imsmanifest.xml',
  },
  {
    id: 'aima-beatrice',
    label: 'AIMA5001 BEATRICE',
    description: 'Variant page (beatrice.md) plus week-1 PDF—same as aima-beatrice-lms-demo.imscc.',
    sourceDir: 'public/demos/imscc-unpacked/aima-beatrice',
    publicBasePath: '/demos/imscc-unpacked/aima-beatrice',
    manifestFile: 'imsmanifest.xml',
  },
]

function fileKind(rel: string): ImsccViewerFileKind {
  const lower = rel.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf'
  if (lower.endsWith('.md')) return 'md'
  return 'other'
}

/** Build-time: read manifests from disk (Astro frontmatter / getStaticPaths only). */
export function loadImsccViewerPackages(): Array<ImsccViewerPackage & { files: ImsccViewerFile[] }> {
  const cwd = process.cwd()
  return imsccViewerPackages
    .map((pkg) => {
      const manifestPath = path.join(cwd, pkg.sourceDir, pkg.manifestFile)
      if (!fs.existsSync(manifestPath)) {
        console.warn(`[imscc-packages] skip missing manifest: ${manifestPath}`)
        return null
      }
      const xml = fs.readFileSync(manifestPath, 'utf8')
      const { files: rels } = parseImsccManifestXml(xml)
      const base = pkg.publicBasePath.replace(/\/$/, '')
      const files: ImsccViewerFile[] = rels.map((rel) => ({
        href: `${base}/${rel.replace(/^\//, '')}`,
        name: path.basename(rel),
        kind: fileKind(rel),
      }))
      return { ...pkg, files }
    })
    .filter((p): p is ImsccViewerPackage & { files: ImsccViewerFile[] } => p !== null)
}

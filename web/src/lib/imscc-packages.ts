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
    label: 'AIMA LMS demo',
    description:
      'Thin Common Cartridge with week-1 PDF slides and a markdown assignment—same payload as the downloadable .imscc.',
    sourceDir: 'demos/aima-imscc-src',
    publicBasePath: '/demos/imscc-unpacked/aima-lms-demo',
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
  return imsccViewerPackages.map((pkg) => {
    const manifestPath = path.join(cwd, pkg.sourceDir, pkg.manifestFile)
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
}

export type ImsccViewerFileKind = 'pdf' | 'md' | 'other'

export interface ImsccViewerFile {
  href: string
  name: string
  kind: ImsccViewerFileKind
}

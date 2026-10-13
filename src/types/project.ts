import type { ClusterId } from './course'

export type ProjectStatus = 'in-progress' | 'completed'

export type ProjectCategory = 'research' | 'project' | 'side' | 'course'

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectMedia {
  kind: 'image' | 'pdf'
  src: string
  thumb?: string
  label: string
}

export interface Org {
  name: string
  logo: string
  url: string
  preview?: string
}

export interface Snapshot {
  src: string
  thumb: string
  label: string
}

export interface Showcase {
  snapshots: Snapshot[]
  video?: string
  booklet?: string
  bookletPreview: string
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  course?: string
  cluster?: ClusterId
  org?: string
  start: string
  end?: string
  status: ProjectStatus
  summary?: string
  result?: string
  contributions?: string[]
  details?: string[]
  media?: ProjectMedia[]
  focus?: string[]
  tech: string[]
  links?: ProjectLink[]
  orgs?: Org[]
  showcase?: Showcase
}

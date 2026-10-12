// src/types/project.ts

export type ProjectStatus = 'in-progress' | 'completed'

// Where a project is shown on the page:
// 'research' → Research section, 'project' → Projects section, 'course' → Course projects (compact)
export type ProjectCategory = 'research' | 'project' | 'course'

export interface ProjectLink {
  label: string // e.g. 'GitHub', 'Paper', 'Live demo'
  url: string
}

// An organization connected to a project (partner, school, club).
// Defined once in data/orgs.ts and reused by any project that needs it.
export interface Org {
  name: string     // shown in the hover preview, and used as alt text
  logo: string     // path inside public/
  url: string      // their website, opened when the logo is clicked
  preview?: string // optional screenshot of their website (path inside public/), shown on hover
}

export interface Project {
  slug: string              // unique id, e.g. 'urban-science-capstone' (used as key, and later for inspector panels)
  title: string
  category: ProjectCategory
  course?: string           // course code for course projects, e.g. 'CSE 404' (will link to the Coursework section)
  org?: string              // partner / affiliation line
  start: string             // 'YYYY-MM', e.g. '2026-08' (used for ordering and the date line)
  end?: string              // 'YYYY-MM'; leave out while ongoing → shows 'Present'
  status: ProjectStatus
  summary: string           // what the project is
  contributions?: string[]  // what *you* did, one bullet per string
  tech: string[]
  links?: ProjectLink[]
  orgs?: Org[]              // logos shown top right of the card
}

export interface Period {
  start: string
  end?: string
}

export interface Experience {
  role: string
  company: string
  location?: string
  logo?: string
  periods: Period[]
  summary: string
}

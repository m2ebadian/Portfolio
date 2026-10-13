export type ClusterId = 'ml-ai' | 'data-stats' | 'software'

export interface Cluster {
  id: ClusterId
  name: string
  color: string
}

export interface Course {
  code: string
  name: string
  cluster: ClusterId
  description: string
  topics: string[]
  prereqs?: string[]
  inProgress?: boolean
}

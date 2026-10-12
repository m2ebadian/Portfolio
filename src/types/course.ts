// src/types/course.ts

// The areas courses are grouped into on the topic map (and colored by in the graph)
export type ClusterId = 'ml-ai' | 'data-stats' | 'software'

export interface Cluster {
  id: ClusterId
  name: string
  color: string // hex; used for graph nodes and the topic map dots, readable on both themes
}

export interface Course {
  code: string          // e.g. 'CSE 404' (unique; also used to link course projects later)
  name: string          // official course title
  cluster: ClusterId
  description: string   // short summary based on the course catalog
  topics: string[]      // shared topics connect courses in the graph
  prereqs?: string[]    // prerequisite course codes from this list; also drawn as connections
  inProgress?: boolean  // currently taking it → 'In progress' badge and a pulsing ring in the graph
}

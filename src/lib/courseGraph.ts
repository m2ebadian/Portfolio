// src/lib/courseGraph.ts
// Turns the course list into graph data: connections (edges) and a neighbor lookup.
import type { Course } from '../types/course'

export interface CourseEdge {
  a: string // course code
  b: string
  kind: 'prereq' | 'topic'
}

// Two courses are connected when one is a prerequisite of the other,
// or when they share at least one topic.
export function buildEdges(courses: Course[]): CourseEdge[] {
  const edges: CourseEdge[] = []
  const seen = new Set<string>()
  const codes = new Set(courses.map((c) => c.code))

  const add = (a: string, b: string, kind: CourseEdge['kind']) => {
    const key = [a, b].sort().join('|')
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ a, b, kind })
  }

  for (const c of courses) {
    for (const p of c.prereqs ?? []) {
      if (codes.has(p)) add(p, c.code, 'prereq')
    }
  }

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const shared = courses[i].topics.some((t) => courses[j].topics.includes(t))
      if (shared) add(courses[i].code, courses[j].code, 'topic')
    }
  }

  return edges
}

// code → set of directly connected codes
export function buildNeighbors(edges: CourseEdge[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const { a, b } of edges) {
    if (!map.has(a)) map.set(a, new Set())
    if (!map.has(b)) map.set(b, new Set())
    map.get(a)!.add(b)
    map.get(b)!.add(a)
  }
  return map
}

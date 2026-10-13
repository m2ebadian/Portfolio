import type { Course } from '../types/course'

export interface CourseEdge {
  a: string
  b: string
  kind: 'prereq' | 'topic'
}

export function buildEdges(courses: Course[]): CourseEdge[] {
  const edges: CourseEdge[] = []
  const seen = new Set<string>()
  const codes = new Set(courses.map((c) => c.code))

  function add(a: string, b: string, kind: CourseEdge['kind']) {
    const key = [a, b].sort().join('|')
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ a, b, kind })
  }

  for (const course of courses) {
    for (const prereq of course.prereqs ?? []) {
      if (codes.has(prereq)) add(prereq, course.code, 'prereq')
    }
  }

  courses.forEach((first, i) => {
    for (const second of courses.slice(i + 1)) {
      if (first.topics.some((t) => second.topics.includes(t))) add(first.code, second.code, 'topic')
    }
  })

  return edges
}

export function buildNeighbors(edges: CourseEdge[]): Map<string, Set<string>> {
  const neighbors = new Map<string, Set<string>>()
  const link = (from: string, to: string) => {
    if (!neighbors.has(from)) neighbors.set(from, new Set())
    neighbors.get(from)!.add(to)
  }
  for (const { a, b } of edges) {
    link(a, b)
    link(b, a)
  }
  return neighbors
}

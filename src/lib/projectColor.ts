import { clusters, courses } from '../data/courses'
import type { Project } from '../types/project'

export function projectColor(project: Pick<Project, 'course' | 'cluster'>): string {
  const clusterId = project.cluster ?? courses.find((c) => c.code === project.course)?.cluster
  return clusters.find((c) => c.id === clusterId)?.color ?? 'var(--accent)'
}

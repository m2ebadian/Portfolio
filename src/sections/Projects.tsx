// src/sections/Projects.tsx
// Current projects alternate sides of the center line, starting on the left. Course projects follow as smaller cards.
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import StatusHeading from '../components/StatusHeading'
import Timeline, { type TimelineItem } from '../components/Timeline'
import { projects } from '../data/projects'

function Projects() {
  // Cards appear in the same order as in data/projects.ts, alternating sides: left, right, left...
  const current: TimelineItem[] = projects
    .filter((p) => p.category === 'project' && p.status === 'in-progress')
    .map((p, i) => ({
      key: p.slug,
      side: i % 2 === 0 ? 'left' : 'right',
      live: true,
      content: <ProjectCard project={p} />,
    }))

  const course = projects.filter((p) => p.category === 'course')

  return (
    <Section id="projects" index="04" title="Projects" wide>
      {current.length > 0 && (
        <Timeline
          items={current}
          leftHeading={<StatusHeading live>Currently working on</StatusHeading>}
        />
      )}

      {/* Course projects: smaller cards, linked to the Coursework section later */}
      {course.length > 0 && (
        <div className="mt-24">
          <StatusHeading>Course projects</StatusHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            {course.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}

export default Projects

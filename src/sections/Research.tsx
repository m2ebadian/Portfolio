// src/sections/Research.tsx
// Research cards sit on the RIGHT side of the center line.
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import StatusHeading from '../components/StatusHeading'
import Timeline, { type TimelineItem } from '../components/Timeline'
import { projects } from '../data/projects'

function Research() {
  // Cards appear in the same order as in data/projects.ts
  const research = projects.filter((p) => p.category === 'research')

  if (research.length === 0) return null

  const items: TimelineItem[] = research.map((p) => ({
    key: p.slug,
    side: 'right',
    live: p.status === 'in-progress',
    content: <ProjectCard project={p} />,
  }))

  const hasOngoing = research.some((p) => p.status === 'in-progress')

  return (
    <Section id="research" index="03" title="Research" wide>
      <Timeline
        items={items}
        rightHeading={
          <StatusHeading live={hasOngoing}>{hasOngoing ? 'Ongoing research' : 'Research'}</StatusHeading>
        }
      />
    </Section>
  )
}

export default Research

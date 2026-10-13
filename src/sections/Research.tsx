import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import StatusHeading from '../components/StatusHeading'
import Timeline, { type TimelineItem } from '../components/Timeline'
import { projects } from '../data/projects'

const research = projects.filter((p) => p.category === 'research')

function Research() {
  if (research.length === 0) return null

  const hasOngoing = research.some((p) => p.status === 'in-progress')

  const items: TimelineItem[] = research.map((p) => ({
    key: p.slug,
    side: 'right',
    live: p.status === 'in-progress',
    content: <ProjectCard project={p} />,
  }))

  return (
    <Section id="research" index="04" title="Research" wide>
      <Timeline
        items={items}
        rightHeading={<StatusHeading live={hasOngoing}>{hasOngoing ? 'Ongoing research' : 'Research'}</StatusHeading>}
      />
    </Section>
  )
}

export default Research

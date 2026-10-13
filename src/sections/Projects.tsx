import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import CourseProjectCard from '../components/CourseProjectCard'
import ShowcasePipeline from '../components/ShowcasePipeline'
import StatusHeading from '../components/StatusHeading'
import Timeline, { type TimelineItem } from '../components/Timeline'
import { projects } from '../data/projects'

// matches one column of the course project grid so both rows line up
const cardWidth = 'w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]'

const current: TimelineItem[] = projects
  .filter((p) => p.category === 'project' && p.status === 'in-progress')
  .map((p, i) => ({
    key: p.slug,
    side: i % 2 === 0 ? 'left' : 'right',
    live: true,
    content: <ProjectCard project={p} />,
    aside: p.showcase && <ShowcasePipeline showcase={p.showcase} />,
  }))

const sideProjects = projects.filter((p) => p.category === 'side')
const courseProjects = projects.filter((p) => p.category === 'course')

function ComingSoonCard() {
  return (
    <div className="flex h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-5 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Coming soon<span className="motion-safe:animate-pulse">…</span>
      </p>
      <p className="mt-2 text-xs text-muted/70">More side projects on the way</p>
    </div>
  )
}

function Projects() {
  return (
    <Section id="projects" index="05" title="Projects" wide>
      {current.length > 0 && (
        <>
          <StatusHeading live>Currently working on</StatusHeading>
          <Timeline items={current} />
        </>
      )}

      {sideProjects.length > 0 && (
        <div className="mt-16">
          <StatusHeading>Side projects</StatusHeading>
          <div className="flex flex-wrap justify-center gap-5">
            {sideProjects.map((project, i) => (
              <div key={project.slug} className={cardWidth}>
                <CourseProjectCard project={project} index={i} />
              </div>
            ))}
            <div className={cardWidth}>
              <ComingSoonCard />
            </div>
          </div>
        </div>
      )}

      {courseProjects.length > 0 && (
        <div className="mt-16">
          <StatusHeading>Course projects</StatusHeading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courseProjects.map((project, i) => (
              <CourseProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}

export default Projects

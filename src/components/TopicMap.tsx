import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Course } from '../types/course'
import { clusters, courses } from '../data/courses'
import { projects } from '../data/projects'
import { buildEdges, buildNeighbors } from '../lib/courseGraph'
import { ease } from '../lib/motion'

interface TopicMapProps {
  focusCode: string | null
  selectedCode: string | null
  onHover: (code: string | null) => void
  onSelect: (code: string) => void
}

function InProgressBadge() {
  return (
    <span className="ml-auto flex shrink-0 items-center gap-1.5 self-center font-mono text-[10px] uppercase tracking-wider text-accent">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      In progress
    </span>
  )
}

function CourseDetails({ course }: { course: Course }) {
  const courseProjects = projects.filter((p) => p.course === course.code)

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      className="overflow-hidden"
    >
      <div className="px-3 pt-1 pb-3 pl-[6rem]">
        <p className="text-sm leading-relaxed text-muted">{course.description}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {course.topics.map((topic) => (
            <li key={topic} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">
              {topic}
            </li>
          ))}
        </ul>

        {courseProjects.map((p) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Project</span>
            {p.title} ↓
          </a>
        ))}
      </div>
    </motion.div>
  )
}

function TopicMap({ focusCode, selectedCode, onHover, onSelect }: TopicMapProps) {
  const neighbors = useMemo(() => buildNeighbors(buildEdges(courses)), [])
  const focusNeighbors = focusCode ? neighbors.get(focusCode) : undefined

  return (
    <div className="space-y-7">
      {clusters.map((cluster) => {
        const members = courses.filter((c) => c.cluster === cluster.id)

        return (
          <div key={cluster.id}>
            <div className="mb-2 flex items-center gap-2.5 px-3">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cluster.color }} />
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{cluster.name}</h3>
              <span className="font-mono text-xs text-muted/60">{members.length}</span>
            </div>

            <ul>
              {members.map((course) => {
                const isSelected = course.code === selectedCode
                const isFocus = course.code === focusCode
                const dimmed = focusCode !== null && !isFocus && !focusNeighbors?.has(course.code)

                return (
                  <li key={course.code}>
                    <button
                      type="button"
                      onMouseEnter={() => onHover(course.code)}
                      onMouseLeave={() => onHover(null)}
                      onFocus={() => onHover(course.code)}
                      onBlur={() => onHover(null)}
                      onClick={() => onSelect(course.code)}
                      aria-expanded={isSelected}
                      className={`flex w-full items-baseline gap-3 rounded-lg border px-3 py-1.5 text-left transition-all duration-300 ${
                        isFocus || isSelected ? 'border-accent/50 bg-accent/10' : 'border-transparent hover:bg-surface'
                      } ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <span className="w-[4.5rem] shrink-0 font-mono text-[11px]" style={{ color: cluster.color }}>
                        {course.code}
                      </span>
                      <span className="text-sm">{course.name}</span>
                      {course.inProgress && <InProgressBadge />}
                    </button>

                    <AnimatePresence initial={false}>{isSelected && <CourseDetails course={course} />}</AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default TopicMap

// src/components/ProjectCard.tsx
import type { Project } from '../types/project'
import OrgLogo from './OrgLogo'
import { formatRange } from '../lib/dates'

interface ProjectCardProps {
  project: Project
  // 'full' for research / current projects, 'compact' for the smaller course project cards
  variant?: 'full' | 'compact'
}

function ProjectCard({ project, variant = 'full' }: ProjectCardProps) {
  const compact = variant === 'compact'
  const meta = [project.course, project.org].filter(Boolean).join(' · ')

  return (
    // @container: the card's layout adapts to its own width (half-width in the timeline, full elsewhere)
    // hover: green border (unchanged) + a slight lift; hover:z-10 keeps the logo preview above nearby cards
    <article
      className={`@container relative rounded-2xl border border-border bg-surface transition-[border-color,translate,box-shadow] duration-300 ease-out hover:z-10 hover:border-accent/50 focus-within:z-10 motion-safe:hover:-translate-y-1 ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      {/* Header: logos top right. In narrow cards they sit above the title, in wide cards beside it. */}
      <div className="flex flex-col-reverse gap-5 @xl:flex-row @xl:items-start @xl:justify-between">
        <div className="min-w-0">
          {meta && (
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{meta}</p>
          )}
          <p className="mt-2 font-mono text-xs text-accent">
            {formatRange(project.start, project.end)}
          </p>
          <h3
            className={`mt-3 font-semibold tracking-tight ${
              compact ? 'text-lg' : 'text-xl md:text-2xl'
            }`}
          >
            {project.title}
          </h3>
        </div>

        {project.orgs && project.orgs.length > 0 && (
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            {project.orgs.map((org) => (
              <OrgLogo key={org.url} org={org} />
            ))}
          </div>
        )}
      </div>

      <p className={`mt-4 leading-relaxed text-muted ${compact ? 'text-sm' : ''}`}>
        {project.summary}
      </p>

      {!compact && project.contributions && project.contributions.length > 0 && (
        <ul className="mt-5 space-y-2">
          {project.contributions.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {project.tech.length > 0 && (
        <ul className={`flex flex-wrap gap-2 ${compact ? 'mt-4' : 'mt-6'}`}>
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {project.links && project.links.length > 0 && (
        <div className={`flex gap-5 ${compact ? 'mt-4' : 'mt-6'}`}>
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export default ProjectCard

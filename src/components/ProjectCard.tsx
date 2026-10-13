import type { CSSProperties } from 'react'
import type { Project } from '../types/project'
import { projectColor } from '../lib/projectColor'
import { formatRange } from '../lib/dates'
import { withLinks } from '../lib/inlineLinks'
import OrgLogo from './OrgLogo'

function ProjectCard({ project }: { project: Project }) {
  const { course, org, orgs, summary, result, contributions, focus, tech, links } = project

  return (
    <article
      id={project.slug}
      style={{ '--c': projectColor(project) } as CSSProperties}
      className="@container relative scroll-mt-28 rounded-2xl border border-[color-mix(in_oklab,var(--c)_35%,var(--border))] bg-surface p-6 transition-[border-color,translate,box-shadow] duration-300 ease-out hover:z-10 hover:border-[var(--c)] focus-within:z-10 motion-safe:hover:-translate-y-1 md:p-8"
    >
      <div className="flex flex-col-reverse gap-5 @xl:flex-row @xl:items-start @xl:justify-between">
        <div className="min-w-0">
          {(course || org) && (
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {course && (
                <a href="#coursework" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-foreground hover:underline">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)]" />
                  {course}
                </a>
              )}
              {course && org && ' · '}
              {org}
            </p>
          )}
          <p className="mt-2 font-mono text-xs text-accent">{formatRange(project.start, project.end)}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
        </div>

        {orgs && orgs.length > 0 && (
          <div className="flex shrink-0 flex-wrap justify-end gap-3">
            {orgs.map((o) => (
              <OrgLogo key={o.url} org={o} />
            ))}
          </div>
        )}
      </div>

      {/* a blank line in the summary starts a new paragraph */}
      {summary && (
        <div className="mt-4 space-y-3 leading-relaxed text-muted">
          {summary.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {result && (
        <p className="mt-4 inline-flex rounded-md bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">{result}</p>
      )}

      {contributions && contributions.length > 0 && (
        <ul className="mt-5 space-y-2">
          {contributions.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c)]" />
              <span>{withLinks(item)}</span>
            </li>
          ))}
        </ul>
      )}

      {focus && focus.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Focus</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {focus.map((area) => (
              <li
                key={area}
                className="rounded-full border border-[color-mix(in_oklab,var(--c)_40%,var(--border))] bg-[color-mix(in_oklab,var(--c)_8%,transparent)] px-3 py-1 font-mono text-xs"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tech.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {tech.map((t) => (
            <li key={t} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
      )}

      {links && links.length > 0 && (
        <div className="mt-6 flex gap-5">
          {links.map((link) => (
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

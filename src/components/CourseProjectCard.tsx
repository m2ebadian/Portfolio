import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { FiDownload, FiExternalLink, FiRotateCw } from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'
import type { Project, ProjectMedia } from '../types/project'
import { projectColor } from '../lib/projectColor'
import { formatRange } from '../lib/dates'
import { ease } from '../lib/motion'

const MAX_TECH = 4

const faceClass =
  'absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--c)_35%,var(--border))] bg-surface p-5 [backface-visibility:hidden] transition-colors duration-300 group-hover:border-[var(--c)]'

function isInteractive(e: MouseEvent) {
  return (e.target as HTMLElement).closest('a, button') !== null
}

function FlipButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-[var(--c)] group-hover:text-[var(--c)] focus-visible:outline-2 focus-visible:outline-accent"
    >
      <FiRotateCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
    </button>
  )
}

function PdfTile({ item }: { item: ProjectMedia }) {
  const fileName = item.src.split('/').pop()

  return (
    <div className="min-w-0">
      <a
        href={item.src}
        target="_blank"
        rel="noopener noreferrer"
        title={`Preview ${item.label} (PDF)`}
        className="block overflow-hidden rounded-lg border border-border bg-white transition hover:border-accent"
      >
        {item.thumb && (
          <img src={item.thumb} alt={`${item.label} first page`} loading="lazy" className="h-20 w-full object-cover object-top" />
        )}
      </a>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] uppercase tracking-widest text-muted">{item.label}</span>
        <span className="flex gap-2 text-muted">
          <a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${item.label}`} className="hover:text-accent">
            <FiExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href={item.src} download={fileName} aria-label={`Download ${item.label}`} className="hover:text-accent">
            <FiDownload className="h-3.5 w-3.5" />
          </a>
        </span>
      </div>
    </div>
  )
}

function backListTitle(project: Project) {
  if (project.contributions?.length) return 'My part'
  return project.category === 'side' ? 'How it works' : "What's inside"
}

function CourseProjectCard({ project, index }: { project: Project; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [peeking, setPeeking] = useState(false)
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  // one-time wiggle so it's obvious the cards flip
  useEffect(() => {
    if (!inView || reducedMotion) return
    const timer = setTimeout(() => setPeeking(true), 500 + index * 180)
    return () => clearTimeout(timer)
  }, [inView, reducedMotion, index])

  const showPeek = peeking && !flipped && !hovered
  let rotateY: number | number[] = hovered ? -6 : 0
  if (flipped) rotateY = hovered ? 174 : 180
  if (showPeek) rotateY = [0, -18, 0]

  const toggle = () => setFlipped((f) => !f)
  const { course, org, title, tech, links, media = [] } = project
  const images = media.filter((m) => m.kind === 'image')
  const pdfs = media.filter((m) => m.kind === 'pdf')
  const listItems = project.contributions?.length ? project.contributions : (project.details ?? [])

  return (
    <div
      ref={ref}
      id={project.slug}
      style={{ '--c': projectColor(project) } as CSSProperties}
      className="group h-[440px] scroll-mt-28 cursor-pointer [perspective:1200px]"
      onClick={(e) => !isInteractive(e) && toggle()}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ rotateY }}
        transition={{ duration: showPeek ? 1.1 : 0.6, ease }}
        onAnimationComplete={() => peeking && setPeeking(false)}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className={faceClass} inert={flipped}>
          <div className="flex items-start justify-between gap-3">
            <p className="flex flex-wrap items-center gap-x-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
              {course ? (
                <a href="#coursework" className="flex items-center gap-1.5 hover:text-foreground hover:underline">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)]" />
                  {course}
                </a>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)]" />
              )}
              {course && org && ' · '}
              {org}
            </p>
            <FlipButton label={`Show details of ${title}`} onClick={toggle} />
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted">{formatRange(project.start, project.end)}</p>

          <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight">{title}</h3>
          <p className="mt-2 line-clamp-[9] text-xs leading-relaxed text-muted">{project.summary}</p>

          <div className="mt-auto">
            {project.result && (
              <p className="inline-flex rounded-md bg-[color-mix(in_oklab,var(--c)_14%,transparent)] px-2 py-1 font-mono text-[10px] text-foreground">
                {project.result}
              </p>
            )}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tech.slice(0, MAX_TECH).map((t) => (
                <li key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted">
                  {t}
                </li>
              ))}
              {tech.length > MAX_TECH && (
                <li className="px-1 py-0.5 font-mono text-[10px] text-muted">+{tech.length - MAX_TECH}</li>
              )}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {links?.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-accent"
                  >
                    {link.label === 'GitHub' ? <FaGithub className="h-3.5 w-3.5" /> : <FiExternalLink className="h-3.5 w-3.5" />}
                    {link.label}
                  </a>
                ))}
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors group-hover:text-[var(--c)]">
                Flip ↻
              </span>
            </div>
          </div>
        </div>

        <div className={`${faceClass} [transform:rotateY(180deg)]`} inert={!flipped}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-snug">{title}</h3>
            <FlipButton label={`Show summary of ${title}`} onClick={toggle} />
          </div>

          {images.map((img) => (
            <a
              key={img.src}
              href={img.src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full-size image"
              className="mt-3 block overflow-hidden rounded-lg border border-border transition hover:border-accent"
            >
              <img src={img.src} alt={img.label} loading="lazy" className="aspect-[4/3] w-full object-cover object-left-top" />
            </a>
          ))}

          {pdfs.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {pdfs.map((pdf) => (
                <PdfTile key={pdf.src} item={pdf} />
              ))}
            </div>
          )}

          {listItems.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{backListTitle(project)}</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                {listItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--c)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {media.length === 0 && listItems.length === 0 && (
            <p className="mt-3 text-xs leading-relaxed text-muted">{project.summary}</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CourseProjectCard

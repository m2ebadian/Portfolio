import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight, FiClock, FiFileText, FiPlay, FiX } from 'react-icons/fi'
import type { Showcase, Snapshot } from '../types/project'
import { ease } from '../lib/motion'

type Status = 'done' | 'running' | 'scheduled'

const statusStyles: Record<Status, { ring: string; chip: string }> = {
  done: { ring: 'border-accent bg-accent/15 text-accent', chip: 'border-accent/40 bg-accent/10 text-accent' },
  running: {
    ring: 'border-[#f59e0b] bg-[#f59e0b]/15 text-[#f59e0b]',
    chip: 'border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]',
  },
  scheduled: { ring: 'border-border bg-surface text-muted', chip: 'border-border text-muted' },
}

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1]
}

function StatusIcon({ status }: { status: Status }) {
  return (
    <span
      className={`relative z-10 grid size-9 place-items-center rounded-full border text-sm ${statusStyles[status].ring}`}
    >
      {status === 'done' && <FiCheck />}
      {status === 'running' && (
        <span className="size-3.5 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin" />
      )}
      {status === 'scheduled' && <FiClock />}
    </span>
  )
}

interface StageProps {
  name: string
  status: Status
  chip: string
  children: ReactNode
}

function Stage({ name, status, chip, children }: StageProps) {
  return (
    <li className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4">
      <StatusIcon status={status} />
      <div className="min-w-0 pb-7">
        <div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-mono text-sm">{name}</p>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusStyles[status].chip}`}
          >
            {chip}
          </span>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  )
}

function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-white/20 bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
      {children}
    </span>
  )
}

interface ViewerProps {
  snapshots: Snapshot[]
  index: number
  onStep: (direction: number) => void
  onClose: () => void
}

function SnapshotViewer({ snapshots, index, onStep, onClose }: ViewerProps) {
  const snapshot = snapshots[index]
  const lenis = useLenis()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', handleKey)
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onStep, lenis])

  const navButton = 'grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={snapshot.label}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <figure className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={snapshot.src}
            src={snapshot.src}
            alt={snapshot.label}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="max-h-[78vh] w-full rounded-xl object-contain shadow-2xl"
          />
        </AnimatePresence>
        <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-white">
          <span>
            {snapshot.label}{' '}
            <span className="ml-2 font-mono text-xs text-white/50">
              {index + 1} / {snapshots.length}
            </span>
          </span>
          <span className="flex gap-2">
            {snapshots.length > 1 && (
              <>
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous snapshot" className={navButton}>
                  <FiChevronLeft />
                </button>
                <button type="button" onClick={() => onStep(1)} aria-label="Next snapshot" className={navButton}>
                  <FiChevronRight />
                </button>
              </>
            )}
            <button type="button" onClick={onClose} aria-label="Close" autoFocus className={navButton}>
              <FiX />
            </button>
          </span>
        </figcaption>
      </figure>
    </motion.div>
  )
}

// the capstone deliverables drawn as a CI pipeline: what's shipped, what's in progress, what's scheduled
function ShowcasePipeline({ showcase }: { showcase: Showcase }) {
  const { snapshots, video, booklet, bookletPreview } = showcase
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const videoId = video && youtubeId(video)
  const done = 1 + (videoId ? 1 : 0) + (booklet ? 1 : 0)

  const step = useCallback(
    (direction: number) =>
      setOpenIndex((i) => (i === null ? i : (i + direction + snapshots.length) % snapshots.length)),
    [snapshots.length],
  )
  const close = useCallback(() => setOpenIndex(null), [])

  // hovering previews it on desktop, clicking keeps it open
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const expanded = pinned || hovered || openIndex !== null

  const stages: { name: string; status: Status }[] = [
    { name: 'snapshots', status: 'done' },
    { name: 'video', status: videoId ? 'done' : 'running' },
    { name: 'booklet', status: booklet ? 'done' : 'scheduled' },
  ]

  return (
    <motion.div
      layout
      transition={{ duration: 0.45, ease }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
      className={`overflow-hidden rounded-2xl border bg-surface md:sticky md:top-24 ${
        expanded ? 'w-full border-border' : 'w-full max-w-xs border-border hover:border-accent/50'
      }`}
    >
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left font-mono text-xs"
      >
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-[#f59e0b] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-[#f59e0b]" />
          </span>
          <span className="text-muted">pipeline</span> design-day
        </span>
        <span className="flex items-center gap-2 text-muted">
          {done}/3
          <FiChevronDown className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div className="h-0.5 bg-border">
        <div className="h-full bg-gradient-to-r from-accent to-[#f59e0b]" style={{ width: `${(done / 3) * 100}%` }} />
      </div>

      {!expanded && (
        <motion.div layout="position" className="flex items-center px-5 py-3">
          {stages.map((stage, i) => (
            <div key={stage.name} className="flex flex-1 items-center last:flex-none">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <span
                  className={`grid size-5 place-items-center rounded-full border text-[10px] ${statusStyles[stage.status].ring}`}
                >
                  {stage.status === 'done' && <FiCheck />}
                  {stage.status === 'running' && (
                    <span className="size-2 rounded-full border border-current border-t-transparent motion-safe:animate-spin" />
                  )}
                  {stage.status === 'scheduled' && <FiClock />}
                </span>
                {stage.name}
              </span>
              {i < stages.length - 1 && <span className="mx-2 h-px flex-1 bg-border" />}
            </div>
          ))}
        </motion.div>
      )}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="stages"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <ol className="relative p-5">
              {/* the rail between stages, with a packet travelling down it */}
              <span aria-hidden className="absolute top-9 bottom-14 left-[2.3rem] w-px bg-border">
                <span className="sp-packet absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
              </span>

              <Stage name="snapshots" status="done" chip={`${snapshots.length} shipped · more soon`}>
                <div className="grid grid-cols-3 gap-2">
                  {snapshots.map((s, i) => (
                    <button
                      key={s.src}
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      aria-label={`Open snapshot: ${s.label}`}
                      className="group overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={s.thumb}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </button>
                  ))}
                  <div className="grid aspect-[16/10] place-items-center rounded-lg border border-dashed border-border text-center font-mono text-[10px] leading-tight text-muted">
                    <span>
                      + more
                      <br />
                      <span className="motion-safe:animate-pulse">coming soon</span>
                    </span>
                  </div>
                </div>
              </Stage>

              <Stage
                name="demo-video"
                status={videoId ? 'done' : 'running'}
                chip={videoId ? 'published' : 'in production'}
              >
                {videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="Project demo video"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="aspect-video w-full rounded-lg border border-border"
                  />
                ) : (
                  <div className="sp-static relative grid aspect-video place-items-center overflow-hidden rounded-lg border border-border bg-neutral-950">
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/20">
                        <FiPlay className="translate-x-0.5" />
                      </span>
                      <ComingSoon>Video · coming soon</ComingSoon>
                    </div>
                  </div>
                )}
              </Stage>

              <Stage
                name="design-day-booklet"
                status={booklet ? 'done' : 'scheduled'}
                chip={booklet ? 'published' : 'Dec 2026'}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-24 shrink-0 overflow-hidden rounded-md border border-border shadow-lg">
                    <img
                      src={bookletPreview}
                      alt=""
                      loading="lazy"
                      className="aspect-[326/404] w-full scale-110 object-cover"
                    />
                    {!booklet && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="-rotate-12">
                          <ComingSoon>Soon</ComingSoon>
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted">
                    <p>Our page in MSU's Design Day booklet.</p>
                    {booklet ? (
                      <a
                        href={booklet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                      >
                        <FiFileText /> View the page ↗
                      </a>
                    ) : (
                      <p className="mt-1 font-mono text-xs">Published in December.</p>
                    )}
                  </div>
                </div>
              </Stage>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {openIndex !== null && (
            <SnapshotViewer snapshots={snapshots} index={openIndex} onStep={step} onClose={close} />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </motion.div>
  )
}

export default ShowcasePipeline

import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import type { BeltItem } from '../types/about'
import { projects } from '../data/projects'
import { ease } from '../lib/motion'
import { useScrollTo } from '../lib/useScrollTo'
import './techBelt.css'

function projectsUsing(item: BeltItem) {
  const names = (item.matches ?? [item.name]).map((n) => n.toLowerCase())
  return projects.filter((p) => p.tech.some((t) => names.includes(t.toLowerCase())))
}

function flash(el: HTMLElement) {
  el.classList.remove('tb-flash')
  void el.offsetWidth // restart the animation if it's already running
  el.classList.add('tb-flash')
  window.setTimeout(() => el.classList.remove('tb-flash'), 2600)
}

interface LogoCardProps {
  item: BeltItem
  selected: boolean
  duplicate: boolean
  onSelect: () => void
}

function LogoCard({ item, selected, duplicate, onSelect }: LogoCardProps) {
  const style = { '--b': item.color } as CSSProperties
  const className = `tb-card group flex min-w-24 shrink-0 flex-col items-center rounded-xl border px-3 py-3 transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-0.5 ${
    selected ? 'tb-selected' : ''
  }`

  const content: ReactNode = (
    <>
      <span className="grid size-11 place-items-center rounded-lg bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        <img src={item.icon} alt="" loading="lazy" decoding="async" className="size-7" draggable={false} />
      </span>
      <span className="mt-2 text-xs font-medium whitespace-nowrap">{item.name}</span>
    </>
  )

  if (projectsUsing(item).length === 0) {
    return (
      <div className={className} style={style} title={item.name}>
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${item.name}: show projects that use it`}
      tabIndex={duplicate ? -1 : 0}
      className={`${className} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent`}
      style={style}
    >
      {content}
    </button>
  )
}

function TechBelt({ items }: { items: BeltItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { margin: '200px' })
  const [selected, setSelected] = useState<string | null>(null)
  const scrollTo = useScrollTo()

  const current = items.find((i) => i.name === selected)
  const used = current ? projectsUsing(current) : []

  function goToProject(slug: string) {
    scrollTo(slug, 112)
    const el = document.getElementById(slug)
    if (el) flash(el)
  }

  return (
    <div ref={ref} data-active={active} className="tb-root">
      <div className="tb-row -mx-6 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] lg:-mx-16">
        <div className="tb-track flex w-max gap-3 pr-3" style={{ animationDuration: `${items.length * 2.6}s` }}>
          {[...items, ...items].map((item, i) => {
            const duplicate = i >= items.length
            return (
              <div key={`${item.name}-${i}`} aria-hidden={duplicate || undefined}>
                <LogoCard
                  item={item}
                  selected={selected === item.name}
                  duplicate={duplicate}
                  onSelect={() => setSelected((s) => (s === item.name ? null : item.name))}
                />
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-1 text-center font-mono text-[10px] text-muted">Click a logo to see where I've used it</p>

      <AnimatePresence initial={false}>
        {current && (
          <motion.div
            key="used"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div
              className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4"
              style={{ '--b': current.color } as CSSProperties}
              aria-live="polite"
            >
              <span className="mr-1 flex items-center gap-2 text-sm">
                <img src={current.icon} alt="" className="size-5" />
                <span className="font-medium">{current.name}</span>
                <span className="text-muted">shows up in</span>
              </span>
              {used.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => goToProject(p.slug)}
                  className="tb-chip rounded-full border px-3 py-1 text-xs transition-colors"
                >
                  {p.title} <span aria-hidden>↓</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="ml-1 font-mono text-[11px] text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TechBelt

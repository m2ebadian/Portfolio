import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { motion, useSpring, type Variants } from 'motion/react'
import { ease } from '../../lib/motion'

const tileIn: Variants = {
  hidden: { opacity: 0, y: 48, rotateX: 18, scale: 0.94 },
  show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.9, ease } },
}

const TILT = 7

interface TileProps {
  color: string
  href?: string
  label?: string
  className?: string
  innerClassName?: string
  children: ReactNode
}

function Tile({ color, href, label, className = '', innerClassName = '', children }: TileProps) {
  const spring = { stiffness: 220, damping: 22 }
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)

  function handleMove(e: PointerEvent<HTMLElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // set as CSS variables so moving the spotlight doesn't re-render
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)

    if (e.pointerType !== 'mouse') return
    rotateY.set((x - 0.5) * TILT)
    rotateX.set((0.5 - y) * TILT)
  }

  function handleLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  const surface = {
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    style: { rotateX, rotateY, transformPerspective: 1000 },
    className: `bt-tile group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-5 outline-none transition-[border-color,box-shadow] duration-500 md:p-6 ${innerClassName}`,
  }

  const content = (
    <>
      <div
        aria-hidden
        className="bt-spot pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </>
  )

  return (
    <motion.div variants={tileIn} className={`min-w-0 ${className}`} style={{ '--c': color } as CSSProperties}>
      {href ? (
        <motion.a {...surface} href={href} target="_blank" rel="noreferrer" aria-label={label}>
          {content}
        </motion.a>
      ) : (
        <motion.div {...surface}>{content}</motion.div>
      )}
    </motion.div>
  )
}

export function TileHead({ icon: Icon, eyebrow, title }: { icon: IconType; eyebrow: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bt-wash bt-ink grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
        <Icon aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      </div>
    </div>
  )
}

export function TileLink({ icon: Icon, children }: { icon?: IconType; children: ReactNode }) {
  return (
    <span className="bt-ink mt-auto inline-flex items-center gap-2 pt-4 font-mono text-xs">
      {Icon && <Icon aria-hidden className="text-sm" />}
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
        ↗
      </span>
    </span>
  )
}

export default Tile

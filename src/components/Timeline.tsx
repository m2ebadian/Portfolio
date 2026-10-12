// src/components/Timeline.tsx
// Left/right layout with a center line and a dot per item. Each item sits on the left
// or right of the line on desktop; on phones everything stacks to the right of a line on the left.
// Used by Research (right side) and Projects (left side); generic so other sections can reuse it.
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from '../lib/motion'

export interface TimelineItem {
  key: string
  side: 'left' | 'right'
  live?: boolean   // pulsing dot for ongoing work
  label?: string   // small tag shown above the card on phones (where sides don't exist)
  content: ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  leftHeading?: ReactNode
  rightHeading?: ReactNode
}

function Dot({ live }: { live?: boolean }) {
  return (
    <span className="relative flex h-3 w-3">
      {live && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
      )}
      <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-accent ring-1 ring-accent/40" />
    </span>
  )
}

function Timeline({ items, leftHeading, rightHeading }: TimelineProps) {
  return (
    <div className="relative">
      {/* The line: left edge on phones, center on desktop */}
      <div className="absolute top-0 bottom-0 left-1.5 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

      {/* Column headings (desktop only) */}
      {(leftHeading || rightHeading) && (
        <div className="mb-10 hidden grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:grid">
          <div className="flex justify-end">{leftHeading}</div>
          <div />
          <div>{rightHeading}</div>
        </div>
      )}

      <ol className="space-y-10 md:space-y-6">
        {items.map((item) => {
          const isLeft = item.side === 'left'

          return (
            <li
              key={item.key}
              className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-0"
            >
              {/* Dot on the line */}
              <div className="flex justify-start pt-8 md:col-start-2 md:row-start-1 md:justify-center">
                <Dot live={item.live} />
              </div>

              {/* Card, sliding in from its side */}
              <motion.div
                initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease }}
                className={`md:row-start-1 ${isLeft ? 'md:col-start-1' : 'md:col-start-3'}`}
              >
                {item.label && (
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent md:hidden">
                    {item.label}
                  </p>
                )}
                {item.content}
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default Timeline

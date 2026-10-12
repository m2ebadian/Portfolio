// src/components/Section.tsx
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { stagger, fadeUp } from '../lib/motion'

interface SectionProps {
  id: string
  index: string // e.g. '01'
  title: string
  wide?: boolean // wider content area (used by Research and Projects so cards have more room)
  children: ReactNode
}

function Section({ id, index, title, wide = false, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-24 md:py-32">
      <motion.div
        className={`mx-auto w-full px-6 ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeUp} className="mb-12 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">{index} /</span>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        </motion.div>

        <motion.div variants={fadeUp}>{children}</motion.div>
      </motion.div>
    </section>
  )
}

export default Section
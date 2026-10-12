// src/lib/motion.ts
import type { Variants } from 'motion/react'

// The site's signature easing: fast start, gentle settle
export const ease = [0.22, 1, 0.36, 1] as const

// Parent that staggers its children
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// Child that rises and fades in
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}
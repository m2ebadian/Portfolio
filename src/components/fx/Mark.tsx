import { useEffect, useRef, type ReactNode } from 'react'
import { annotate } from 'rough-notation'
import { useIsDark } from '../../lib/useIsDark'
import type { RoughAnnotationType } from 'rough-notation/lib/model'

// svg attributes can't read css variables or color-mix, so turn the color into plain rgba first
function resolveColor(color: string, el: HTMLElement) {
  const probe = document.createElement('span')
  probe.style.color = color
  el.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return computed
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
}

interface MarkProps {
  children: ReactNode
  type?: RoughAnnotationType
  color?: string
  delay?: number
}

// a hand-drawn underline, circle or highlight that draws itself once it scrolls into view
function Mark({ children, type = 'underline', color = 'var(--accent)', delay = 0 }: MarkProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const dark = useIsDark()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resolved = resolveColor(color, el)
    const annotation = annotate(el, {
      type,
      color: resolved,
      strokeWidth: type === 'highlight' ? 1 : 2,
      padding: type === 'circle' ? 5 : 2,
      animate: !still,
      animationDuration: 900,
      multiline: true,
    })
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        timer = window.setTimeout(() => annotation.show(), delay)
        observer.disconnect()
      },
      { threshold: 1 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      annotation.remove()
    }
  }, [type, color, delay, dark])

  return (
    <span ref={ref} className="relative">
      {children}
    </span>
  )
}

export default Mark

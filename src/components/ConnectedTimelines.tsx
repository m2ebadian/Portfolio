import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

interface Bridge {
  top: number
  height: number
  left: number
}

// offsetTop/offsetLeft ignore transforms, so cards mid-animation don't skew this
function offsetWithin(el: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

// continues the timeline line through the gap between Research and Projects
function ConnectedTimelines({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [bridges, setBridges] = useState<Bridge[]>([])

  useLayoutEffect(() => {
    const container = ref.current
    if (!container) return

    function measure() {
      const timelines = Array.from(container!.querySelectorAll<HTMLElement>('[data-timeline]'))
      const next: Bridge[] = []

      timelines.slice(0, -1).forEach((upper, i) => {
        const lower = timelines[i + 1]
        const dot = upper.querySelector<HTMLElement>('[data-timeline-dot]')
        if (!dot) return

        const top = offsetWithin(upper, container!).y + upper.offsetHeight
        const bottom = offsetWithin(lower, container!).y
        const left = offsetWithin(dot, container!).x + dot.offsetWidth / 2
        next.push({ top, height: Math.max(0, bottom - top), left })
      })

      setBridges(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      {bridges.map((bridge, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute w-px -translate-x-1/2 bg-border"
          style={bridge}
        />
      ))}
      {children}
    </div>
  )
}

export default ConnectedTimelines

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import TopicMap from '../components/TopicMap'

// three.js is heavy, so the graph gets its own chunk
const CourseGraph = lazy(() => import('../components/CourseGraph'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function Coursework() {
  const [hoverCode, setHoverCode] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const focusCode = hoverCode ?? selectedCode

  const reducedMotion = useReducedMotion() ?? false
  const [webgl] = useState(supportsWebGL)
  const [touch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  const graphRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // the scene only renders while it's on screen
  useEffect(() => {
    const el = graphRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggleSelect = (code: string) => setSelectedCode((current) => (current === code ? null : code))

  return (
    <Section id="coursework" index="02" title="Coursework">
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted">
        Grouped by area. {touch ? 'Tap' : 'Hover'} a course to trace what it connects to; select one for details.
      </p>

      <div className={`grid gap-8 ${webgl ? 'lg:grid-cols-2 lg:gap-10' : ''}`}>
        {webgl && (
          <div
            ref={graphRef}
            className="relative h-[320px] overflow-hidden rounded-2xl border border-border bg-surface sm:h-[380px] lg:sticky lg:top-24 lg:h-[420px]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--accent)_9%,transparent),transparent_70%)]" />

            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center font-mono text-xs text-muted">Loading graph…</div>
              }
            >
              <CourseGraph
                focusCode={focusCode}
                selectedCode={selectedCode}
                onHover={setHoverCode}
                onSelect={toggleSelect}
                active={inView}
                reducedMotion={reducedMotion}
                touch={touch}
              />
            </Suspense>

            <p className="pointer-events-none absolute right-4 bottom-3 left-4 flex justify-between font-mono text-[10px] text-muted/70">
              <span>{touch ? '' : 'drag to rotate'}</span>
              <span>─ shared topic&nbsp;&nbsp;┄ prerequisite</span>
            </p>
          </div>
        )}

        <TopicMap focusCode={focusCode} selectedCode={selectedCode} onHover={setHoverCode} onSelect={toggleSelect} />
      </div>
    </Section>
  )
}

export default Coursework

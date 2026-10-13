import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// section titles rise in letter by letter when they scroll into view, then drift with the scroll
function SplitTitle({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 110,
        rotate: 8,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })

      // the title drifts a little slower than the page while you scroll past it
      gsap.fromTo(
        el,
        { y: 28 },
        { y: -28, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
      )
    }, el)
    return () => ctx.revert()
  }, [text])

  return (
    <h2 ref={ref} className={className}>
      {text}
    </h2>
  )
}

export default SplitTitle

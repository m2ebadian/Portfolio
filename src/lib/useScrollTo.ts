import { useLenis } from 'lenis/react'

export function useScrollTo() {
  const lenis = useLenis()

  return (id: string, offset = 72) => {
    if (id === 'top') {
      if (lenis) lenis.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -offset })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}

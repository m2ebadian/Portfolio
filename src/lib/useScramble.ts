import { useEffect, useState } from 'react'

// Latin, digits and Persian letters, so the name "decodes" out of mixed noise
const GLYPHS = 'ABCDEFGHKMNRSTXZ0123456789#%&*/<>ابپتجچحخدرزسشصطعفقکگلمنوهی'

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

// Returns the text with letters still scrambling; each letter settles in order over `duration` ms.
export function useScramble(text: string, { duration = 1400, delay = 0, enabled = true } = {}) {
  const [output, setOutput] = useState(() => (enabled ? text.replace(/\S/g, randomGlyph) : text))

  useEffect(() => {
    if (!enabled) {
      setOutput(text)
      return
    }

    let frame = 0
    let start: number | null = null

    function tick(now: number) {
      start ??= now + delay
      const progress = Math.max(0, (now - start) / duration)
      const settled = Math.floor(progress * text.length)

      setOutput(
        Array.from(text, (char, i) => (char === ' ' || i < settled ? char : randomGlyph())).join(''),
      )

      if (settled < text.length) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, duration, delay, enabled])

  return output
}

import { MeshGradient } from '@paper-design/shaders-react'
import { useReducedMotion } from 'motion/react'
import { useIsDark } from '../../lib/useIsDark'

const colors = {
  dark: ['#04060c', '#0b343a', '#1d1446', '#05121c', '#221405'],
  light: ['#f7f8f5', '#cfeee8', '#e6dcff', '#fbf0dc', '#f3f6f9'],
}

// a slow-moving mesh gradient behind the whole page, with a faint grid on top
function Backdrop() {
  const dark = useIsDark()
  const reducedMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50">
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={dark ? colors.dark : colors.light}
        distortion={0.85}
        swirl={0.35}
        grainMixer={0.12}
        grainOverlay={dark ? 0.12 : 0.08}
        speed={reducedMotion ? 0 : 0.18}
        maxPixelCount={900_000}
      />
      <div className="backdrop-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)] opacity-70" />
    </div>
  )
}

export default Backdrop

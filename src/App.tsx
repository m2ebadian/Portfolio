import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { MotionConfig, useReducedMotion } from 'motion/react'

import Hero from './sections/Hero'
import About from './sections/About'
import Research from './sections/Research'
import Projects from './sections/Projects'
import Coursework from './sections/Coursework'
import ThemeToggle from './components/ThemeToggle'

function App() {
  // true when the visitor's OS has "reduce motion" turned on
  const prefersReducedMotion = useReducedMotion()

  return (
    // Every Motion animation inside respects the visitor's reduce-motion setting
    <MotionConfig reducedMotion="user">
      {/* Smooth scrolling for the whole page, skipped for reduced-motion visitors */}
      {!prefersReducedMotion && <ReactLenis root />}

      {/* Temporary placement until the navbar exists */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main>
        <Hero />
        <About />
        <Coursework />
        <Research />
        <Projects />
      </main>
    </MotionConfig>
  )
}

export default App
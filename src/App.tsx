import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { MotionConfig, useReducedMotion } from 'motion/react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ConnectedTimelines from './components/ConnectedTimelines'
import Hero from './sections/Hero'
import About from './sections/About'
import Coursework from './sections/Coursework'
import Experience from './sections/Experience'
import Research from './sections/Research'
import Projects from './sections/Projects'
import BeyondTheData from './sections/BeyondTheData'
import Contact from './sections/Contact'

function App() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
      {!prefersReducedMotion && <ReactLenis root />}

      <Navbar />

      <main id="top">
        <Hero />
        <About />
        <Coursework />
        <Experience />
        <ConnectedTimelines>
          <Research />
          <Projects />
        </ConnectedTimelines>
        <BeyondTheData />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  )
}

export default App

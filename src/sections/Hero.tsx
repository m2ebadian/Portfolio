import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { profile } from '../data/profile'
import { icons } from '../components/icons'
import { stagger, fadeUp } from '../lib/motion'
import { supportsWebGL } from '../lib/webgl'
import { useInViewport } from '../lib/useInViewport'
import { useIsDark } from '../lib/useIsDark'
import { useScramble } from '../lib/useScramble'
import Magnetic from '../components/fx/Magnetic'
import Mark from '../components/fx/Mark'

const HeroField = lazy(() => import('../components/HeroField'))

const STAGE_MS = 6500

// noise first, then it alternates between the signal and the pattern
function useStage(running: boolean) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!running) return
    const wait = stage === 0 ? 1600 : STAGE_MS
    const timer = setTimeout(() => setStage((s) => (s === 1 ? 2 : 1)), wait)
    return () => clearTimeout(timer)
  }, [stage, running])

  return stage
}

function ScrambleName({ text, enabled }: { text: string; enabled: boolean }) {
  const scrambled = useScramble(text, { duration: 1300, delay: 350, enabled })

  let index = 0
  return (
    <span aria-label={text}>
      {text.split(' ').map((word, w) => {
        const start = index
        index += word.length + 1
        return (
          <span key={w}>
            {w > 0 && ' '}
            <span aria-hidden className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, i) => {
                const shown = scrambled[start + i]
                // the real letter holds the width so nothing shifts while the glyphs change
                return (
                  <span key={i} className="relative inline-block">
                    <span className="invisible">{char}</span>
                    <span className={`absolute inset-0 text-center ${shown === char ? '' : 'text-accent'}`}>
                      {shown}
                    </span>
                  </span>
                )
              })}
            </span>
          </span>
        )
      })}
    </span>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const active = useInViewport(ref, '0px')
  const dark = useIsDark()
  const reducedMotion = useReducedMotion() ?? false
  const [webgl] = useState(supportsWebGL)
  const stage = useStage(active && webgl && !reducedMotion)

  // scrolling away scatters the particles and lifts the text out
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textBlur = useTransform(scrollYProgress, [0, 0.6], ['blur(0px)', 'blur(8px)'])
  const [lead, rest] = profile.headline.split('Data Science & AI')

  return (
    <section ref={ref} className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden">
      {webgl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.2 }}
          >
            <Suspense fallback={null}>
              <HeroField
                scatter={scrollYProgress}
                shape={reducedMotion ? 2 : stage}
                active={active}
                dark={dark}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </motion.div>
          {/* keeps the text readable over the particles */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent md:from-background/50 md:via-transparent" />
        </div>
      )}

      <motion.div
        className="mx-auto w-full max-w-5xl px-6"
        style={reducedMotion ? undefined : { y: textY, opacity: textOpacity, filter: textBlur }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={fadeUp} className="font-mono text-sm uppercase tracking-widest text-accent">
          Full-Stack · Data Science &amp; AI
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-4 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-tight"
        >
          <ScrambleName text={profile.name} enabled={!reducedMotion} />
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 text-lg font-medium md:text-xl">
          {rest === undefined ? (
            profile.headline
          ) : (
            <>
              {lead}
              <Mark type="highlight" color="color-mix(in oklab, var(--accent) 22%, transparent)" delay={1600}>
                Data Science &amp; AI
              </Mark>
              {rest}
            </>
          )}
        </motion.p>

        <motion.p variants={fadeUp} className="mt-3 max-w-xl text-lg text-muted md:text-xl">
          {profile.tagline}
        </motion.p>

        <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-6">
          {profile.links.map((link) => {
            const Icon = link.icon ? icons[link.icon] : null
            const isEmail = link.url.startsWith('mailto:')

            return (
              <li key={link.label}>
                <Magnetic strength={0.4}>
                  <a
                    href={link.url}
                    target={isEmail ? undefined : '_blank'}
                    rel={isEmail ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-2 text-muted transition-colors hover:text-accent"
                  >
                    {Icon && <Icon className="text-lg" />}
                    {link.label}
                  </a>
                </Magnetic>
              </li>
            )
          })}
        </motion.ul>
      </motion.div>

    </section>
  )
}

export default Hero

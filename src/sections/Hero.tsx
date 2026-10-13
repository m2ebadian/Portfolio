import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { icons } from '../components/icons'
import { stagger, fadeUp } from '../lib/motion'

function Hero() {
  return (
    <section className="flex min-h-screen flex-col justify-center">
      <motion.div className="mx-auto w-full max-w-5xl px-6" variants={stagger} initial="hidden" animate="show">
        <motion.p variants={fadeUp} className="font-mono text-sm uppercase tracking-widest text-accent">
          Full-Stack · Data Science &amp; AI
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-4 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-tight"
        >
          {profile.name}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 text-lg font-medium md:text-xl">
          {profile.headline}
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
                <a
                  href={link.url}
                  target={isEmail ? undefined : '_blank'}
                  rel={isEmail ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  {Icon && <Icon className="text-lg" />}
                  {link.label}
                </a>
              </li>
            )
          })}
        </motion.ul>
      </motion.div>
    </section>
  )
}

export default Hero

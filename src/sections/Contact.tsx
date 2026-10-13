import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiArrowUpRight, FiCheck, FiCopy } from 'react-icons/fi'
import Section from '../components/Section'
import { icons } from '../components/icons'
import { profile } from '../data/profile'
import Magnetic from '../components/fx/Magnetic'
import Mark from '../components/fx/Mark'

const emailLink = profile.links.find((l) => l.url.startsWith('mailto:'))
const email = emailLink?.url.replace('mailto:', '') ?? ''
const otherLinks = profile.links.filter((l) => l !== emailLink)

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard can be blocked; the mailto link still works
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className="relative inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'done' : 'copy'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <FiCheck className="text-accent" /> : <FiCopy />}
          {copied ? 'Copied' : 'Copy email'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function Contact() {
  return (
    <Section id="contact" index="07" title="Contact">
      <div className="relative max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-accent/15 blur-3xl"
        />

        <p className="font-mono text-xs uppercase tracking-widest text-accent">Get in touch</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Let's build something{' '}
          <Mark type="circle" delay={300}>
            useful
          </Mark>
          .
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">{profile.contact}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a
              href={emailLink?.url}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              {email}
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <CopyEmailButton />
          </Magnetic>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
          {otherLinks.map((link) => {
            const Icon = link.icon ? icons[link.icon] : null
            return (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  {Icon && <Icon className="text-base" aria-hidden />}
                  {link.label}
                  <FiArrowUpRight className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

export default Contact

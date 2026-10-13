import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { profile } from '../data/profile'
import { ease } from '../lib/motion'
import { useScrollTo } from '../lib/useScrollTo'
import ThemeToggle from './ThemeToggle'
import Magnetic from './fx/Magnetic'

const links = [
  { id: 'about', label: 'About' },
  { id: 'coursework', label: 'Coursework' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'contact', label: 'Contact' },
]

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const { id } of links) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return active
}

function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const scrollTo = useScrollTo()

  // hide on scroll down past the hero, show on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > previous && y > 400 && !open)
  })

  function handleLink(e: MouseEvent, id: string) {
    e.preventDefault()
    setOpen(false)
    scrollTo(id)
  }

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-border/70 bg-background/75 backdrop-blur-md' : 'border-b border-transparent'
      }`}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease }}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          onClick={(e) => handleLink(e, 'top')}
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface transition-colors group-hover:border-accent">
            MB
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="mr-2 hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleLink(e, link.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-surface ring-1 ring-border"
                        transition={{ duration: 0.35, ease }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <Magnetic>
            <a
              href={profile.resume}
              download
              className="mr-2 hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              <FiDownload aria-hidden />
              Résumé
            </a>
          </Magnetic>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="ml-2 rounded-full border border-border bg-surface p-2 text-lg lg:hidden"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden px-6 lg:hidden"
          >
            {links.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                className="border-t border-border/60 first:border-t-0"
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleLink(e, link.id)}
                  className={`flex items-center justify-between py-3 text-base ${
                    active === link.id ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {link.label}
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </a>
              </motion.li>
            ))}
            <li className="border-t border-border/60 py-3 sm:hidden">
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
              >
                <FiDownload aria-hidden />
                Download résumé
              </a>
            </li>
            <li className="h-3" />
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar

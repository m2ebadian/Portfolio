import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Org } from '../types/project'
import { ease } from '../lib/motion'

function OrgLogo({ org }: { org: Org }) {
  const [open, setOpen] = useState(false)
  const host = new URL(org.url).hostname.replace(/^www\./, '')

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        href={org.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${org.name} (opens in a new tab)`}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex h-14 items-center rounded-xl border border-border bg-white px-4 shadow-sm @xl:h-16 @xl:px-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <img src={org.logo} alt="" className="h-8 w-auto max-w-[12rem] object-contain @xl:h-10 @xl:max-w-[14rem]" />
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="pointer-events-none absolute top-full right-0 z-30 mt-3 w-72 max-w-[80vw] origin-top-right overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
          >
            {org.preview ? (
              <img src={org.preview} alt="" className="aspect-video w-full border-b border-border object-cover object-top" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center border-b border-border bg-white p-8">
                <img src={org.logo} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{org.name}</p>
                <p className="truncate font-mono text-xs text-muted">{host}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-accent">Visit ↗</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrgLogo

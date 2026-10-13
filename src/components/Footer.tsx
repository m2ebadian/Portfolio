import { FiArrowUp } from 'react-icons/fi'
import { profile } from '../data/profile'
import { useScrollTo } from '../lib/useScrollTo'
import { icons } from './icons'

function Footer() {
  const scrollTo = useScrollTo()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mt-1 font-mono text-xs">Built with React, TypeScript &amp; Tailwind CSS</p>
        </div>

        <div className="flex items-center gap-5">
          <ul className="flex items-center gap-4">
            {profile.links.map((link) => {
              const Icon = link.icon ? icons[link.icon] : null
              const isEmail = link.url.startsWith('mailto:')
              return (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target={isEmail ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={link.label}
                    className="text-lg transition-colors hover:text-accent"
                  >
                    {Icon ? <Icon /> : link.label}
                  </a>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => scrollTo('top')}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent hover:text-foreground"
          >
            Back to top <FiArrowUp aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer

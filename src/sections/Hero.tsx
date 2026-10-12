// src/sections/Hero.tsx
import { profile } from '../data/profile'
import { icons } from '../components/icons'

function Hero() {
  return (
    // TODO: layout — full height? centered? background?
    <section className="min-h-screen flex flex-col justify-center">
      {/* TODO: width + side padding for readability (max-w-*, mx-auto, px-*) */}
      <div>
        <h1 className="text-5xl font-bold">{profile.name}</h1>

        {/* TODO: style headline and tagline */}
        <p>{profile.headline}</p>
        <p>{profile.tagline}</p>

        {/* TODO: spacing between links, hover states, icon size */}
        <ul className="flex gap-4">
          {profile.links.map((link) => {
            const Icon = link.icon ? icons[link.icon] : null

            return (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon />}
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Hero
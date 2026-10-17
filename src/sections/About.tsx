import { FiDownload, FiMapPin } from 'react-icons/fi'
import Section from '../components/Section'
import TechBelt from '../components/TechBelt'
import { about } from '../data/about'
import { profile } from '../data/profile'

function LocationCard() {
  return (
    <div className="relative mt-4 flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface px-4 py-3.5">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(90deg,transparent,black_60%)]"
      />
      <span aria-hidden className="relative grid size-10 shrink-0 place-items-center">
        <span className="absolute size-10 rounded-full bg-accent/20 motion-safe:animate-ping" />
        <span className="relative grid size-8 place-items-center rounded-full bg-accent/15 text-accent">
          <FiMapPin />
        </span>
      </span>
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Based in</p>
        <p className="text-sm font-medium">{profile.location}</p>
      </div>
    </div>
  )
}

function About() {
  const { photo } = about

  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
        <div className="w-full max-w-sm">
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl border border-border object-cover"
          />
          <LocationCard />
          <a
            href={profile.resume}
            download
            className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <FiDownload className="transition-transform group-hover:translate-y-0.5" aria-hidden />
            Download resume
          </a>
        </div>

        <div>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">{about.subheading}</p>

          <div className="mt-6 space-y-4 leading-relaxed text-muted md:text-lg">
            {about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* a tall fact spans two rows so the next one fills the space beside it */}
          <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-flow-row-dense sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div key={fact.label} className={fact.tall ? 'sm:col-start-2 sm:row-span-2' : ''}>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{fact.label}</dt>
                <dd className="mt-1 flex items-center gap-2">
                  {fact.logo && (
                    <span className="flex h-7 shrink-0 items-center rounded-md border border-border bg-white px-1.5">
                      <img src={fact.logo} alt="" className="h-5 w-auto" />
                    </span>
                  )}
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="font-mono text-sm uppercase tracking-widest text-accent">Tech stack</h3>

        <div className="mt-5">
          <TechBelt items={about.belt} />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.stack.map((group) => (
            <div key={group.category}>
              <p className="text-sm font-medium">{group.category}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default About

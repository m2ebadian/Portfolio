// src/sections/About.tsx
import Section from '../components/Section'
import { about } from '../data/about'

function About() {
  return (
    <Section id="about" index="01" title="About">
      {/* Photo + text: stacked on phones, side by side from md up */}
      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
        <img
          src={about.photo.src}
          alt={about.photo.alt}
          width={about.photo.width}
          height={about.photo.height}
          loading="lazy"
          className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-border object-cover"
        />

        <div>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">
            {about.subheading}
          </p>

          <div className="mt-6 space-y-4 leading-relaxed text-muted md:text-lg">
            {about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* Facts grid: <dl> is the semantic element for label/value pairs */}
          <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                  {fact.label}
                </dt>
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

      {/* Tech stack, grouped */}
      <div className="mt-20">
        <h3 className="font-mono text-sm uppercase tracking-widest text-accent">Tech stack</h3>

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
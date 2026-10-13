import { FiMapPin } from 'react-icons/fi'
import Section from '../components/Section'
import { experience } from '../data/experience'
import { formatRange } from '../lib/dates'

function Experience() {
  if (experience.length === 0) return null

  return (
    <Section id="experience" index="03" title="Experience">
      <ul className="border-b border-border">
        {experience.map((item) => (
          <li
            key={`${item.company}-${item.role}`}
            className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-border py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-6"
          >
            <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-border bg-white p-2 transition duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/50 sm:w-24">
              {item.logo && <img src={item.logo} alt={`${item.company} logo`} className="max-h-full max-w-full object-contain" />}
            </div>

            <div className="min-w-0">
              <h3 className="font-medium leading-snug transition-colors duration-300 group-hover:text-accent">{item.role}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{item.company}</span>
                {item.location && (
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <FiMapPin aria-hidden className="h-3 w-3" />
                    {item.location}
                  </span>
                )}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{item.summary}</p>
            </div>

            <div className="col-start-2 mt-3 space-y-0.5 font-mono text-xs text-muted sm:col-start-3 sm:mt-0.5 sm:text-right">
              {item.periods.map((period) => (
                <p key={period.start}>{formatRange(period.start, period.end)}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default Experience

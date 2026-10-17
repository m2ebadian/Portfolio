import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FaSpotify, FaFilm, FaGamepad, FaBasketballBall, FaLanguage, FaUsers } from 'react-icons/fa'
import { GiWeightLiftingUp, GiCookingPot } from 'react-icons/gi'
import { SiLetterboxd } from 'react-icons/si'
import { beyond } from '../../data/beyond'
import { ease } from '../../lib/motion'
import Tile, { TileHead, TileLink } from './Tile'
import FoodGallery from './FoodGallery'
import { PersianPattern, PersianMedallion, Vinyl, Equalizer, FilmStrip, Barbell, Crosshair, Basketball, PingPong } from './graphics'

const { heritage, languages, clubs, music, movies, fitness, games, sports, food } = beyond

export function HeritageTile() {
  const [firstWord, ...rest] = heritage.title.split(' ')

  return (
    <Tile color="#239f40" className="bt-iran sm:col-span-2 lg:row-span-2" innerClassName="bt-iran-bg">
      <PersianPattern />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Heritage</p>
      <h3 className="mt-3 max-w-xs text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
        <span className="text-[var(--ir-green)]">{firstWord}</span>{' '}
        <span className="text-[var(--ir-red)]">{rest.join(' ')}</span>
      </h3>

      <motion.div
        aria-hidden
        className="mt-5 flex h-1 w-28 origin-left overflow-hidden rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease }}
      >
        <span className="flex-1 bg-[#239f40]" />
        <span className="flex-1 bg-white ring-1 ring-border ring-inset" />
        <span className="flex-1 bg-[#da0000]" />
      </motion.div>

      <p className="relative mt-5 max-w-sm text-sm leading-relaxed text-muted sm:max-w-[16rem] lg:max-w-[15rem]">
        {heritage.text}
      </p>

      <PersianMedallion className="mx-auto my-6 size-72 sm:absolute sm:-right-12 sm:-bottom-12 sm:m-0 sm:size-[26rem]" />
    </Tile>
  )
}

function Greeting({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!active || paused || reducedMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % languages.length), 2400)
    return () => clearInterval(timer)
  }, [active, paused, reducedMotion])

  const language = languages[index]

  return (
    <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="flex flex-1 flex-col">
      <div className="relative mt-5 grid h-28 place-items-center overflow-hidden rounded-xl bg-neutral-950 [perspective:600px]">
        <div aria-hidden className="absolute inset-x-0 top-1/2 z-10 h-px bg-black/80" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={language.lang}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="text-center"
          >
            <p lang={language.lang} dir={language.dir} className="text-5xl font-semibold text-white">
              {language.greeting}
            </p>
            {language.romanized && <p className="mt-1 font-mono text-[11px] text-white/50">{language.romanized}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Languages I speak">
        {languages.map((l, i) => {
          const selected = i === index
          return (
            <button
              key={l.lang}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={selected}
              className={`relative rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                selected ? 'text-white' : 'bt-chip text-muted hover:text-foreground'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--c)]"
                  transition={{ duration: 0.4, ease }}
                />
              )}
              {l.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function LanguagesTile({ active }: { active: boolean }) {
  return (
    <Tile color="#8b5cf6" className="lg:col-span-2">
      <TileHead icon={FaLanguage} eyebrow="Languages" title={`I speak ${languages.length}`} />
      <Greeting active={active} />
    </Tile>
  )
}

export function MusicTile() {
  return (
    <Tile color="#1db954" href={music.url} label="My Spotify profile" className="lg:col-span-2">
      <div className="flex h-full flex-col gap-5 sm:flex-row sm:items-center">
        <Vinyl />
        <div className="flex min-w-0 flex-1 flex-col self-stretch">
          <TileHead icon={FaSpotify} eyebrow="On repeat" title="Music" />
          <p className="mt-3 text-xs text-muted">{music.text}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {music.artists.map((artist, i) => (
              <li
                key={artist}
                className="bt-chip rounded-full px-2.5 py-1 text-xs transition-transform duration-300 group-hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {artist}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between gap-3">
            <TileLink>Spotify</TileLink>
            <Equalizer />
          </div>
        </div>
      </div>
    </Tile>
  )
}

export function MoviesTile() {
  return (
    <Tile color="#40bcf4" href={movies.url} label="My Letterboxd profile">
      <FilmStrip />
      <TileHead icon={FaFilm} eyebrow="Watching" title="Movies" />
      <p className="mt-3 text-xs leading-relaxed text-muted">{movies.text}</p>
      <TileLink icon={SiLetterboxd}>Letterboxd</TileLink>
    </Tile>
  )
}

export function FitnessTile() {
  return (
    <Tile color="#f97316" href={fitness.url} label="My Liftcard profile">
      <Barbell />
      <div className="mt-3">
        <TileHead icon={GiWeightLiftingUp} eyebrow="Training" title="Working out" />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{fitness.text}</p>
      <TileLink>Liftcard</TileLink>
    </Tile>
  )
}

const hudCorners = [
  'top-0 left-0 border-t-2 border-l-2',
  'top-0 right-0 border-t-2 border-r-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'bottom-0 right-0 border-b-2 border-r-2',
]

export function GamesTile() {
  return (
    <Tile color="#ff4655">
      <div className="relative flex justify-center">
        <div aria-hidden className="absolute inset-0">
          {hudCorners.map((corner) => (
            <span
              key={corner}
              className={`absolute size-3 border-[var(--c)] opacity-60 transition-all duration-300 group-hover:size-5 group-hover:opacity-100 ${corner}`}
            />
          ))}
        </div>
        <Crosshair />
      </div>
      <div className="mt-4">
        <TileHead icon={FaGamepad} eyebrow={games.text} title="Gaming" />
      </div>
      <ul className="mt-auto space-y-1.5 pt-4">
        {games.titles.map((title, i) => (
          <li key={title} className="flex items-center justify-between font-mono text-xs">
            <span>{title}</span>
            <span className="bt-ink">0{i + 1}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}

export function SportsTile() {
  return (
    <Tile color="#0076b6">
      <div className="flex items-end justify-between">
        <Basketball />
        <div className="flex gap-2">
          {sports.logos.map((logo) => (
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="h-14 w-auto rounded-lg object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110"
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <TileHead icon={FaBasketballBall} eyebrow={sports.text} title="Sports" />
      </div>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {sports.teams.map((team) => (
          <li key={team} className="bt-chip rounded-full px-2.5 py-1 font-mono text-xs">
            {team}
          </li>
        ))}
      </ul>
    </Tile>
  )
}

export function FoodTile() {
  return (
    <Tile color="#eab308" className="sm:col-span-2">
      <TileHead icon={GiCookingPot} eyebrow="In the kitchen" title="Cooking & baking" />
      <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">{food.text}</p>
      <div className="mt-auto">
        <FoodGallery photos={food.photos} />
      </div>
    </Tile>
  )
}

export function ClubsTile() {
  return (
    <Tile color="#14b8a6" className="sm:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <TileHead icon={FaUsers} eyebrow="On campus" title="Clubs" />
        <PingPong />
      </div>
      <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
        {clubs.map((club, i) => (
          <li key={club.name} className="flex items-baseline gap-3 border-b border-border/70 py-2 text-sm">
            <span className="bt-ink font-mono text-[10px]">0{i + 1}</span>
            {club.url ? (
              <a href={club.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {club.name} <span aria-hidden className="text-muted">↗</span>
              </a>
            ) : (
              <span>{club.name}</span>
            )}
            {club.flag && (
              <img
                src={club.flag}
                alt=""
                className="h-3 w-auto self-center rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
              />
            )}
            {club.logo && <img src={club.logo} alt="" className="size-5 self-center rounded-[5px]" />}
          </li>
        ))}
      </ul>
    </Tile>
  )
}

import { useId, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { ease } from '../../lib/motion'

// 8-pointed star, as in Persian tilework
function starPoints(outer: number, inner: number, cx = 0, cy = 0) {
  return Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / 8) * i - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

function draw(delay: number) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 2.2, delay, ease },
  }
}

interface SquareProps {
  size: number
  rotate: number
  color: string
  width: number
  delay: number
}

function Square({ size, rotate, color, width, delay }: SquareProps) {
  const half = size / 2
  return (
    <g transform={rotate ? `rotate(${rotate})` : undefined}>
      <motion.rect x={-half} y={-half} width={size} height={size} stroke={color} strokeWidth={width} {...draw(delay)} />
    </g>
  )
}

export function PersianPattern() {
  const id = useId()
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.2] [mask-image:radial-gradient(circle_at_75%_70%,black,transparent_75%)]"
    >
      <defs>
        <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
          <polygon points={starPoints(14, 7.5, 22, 22)} fill="none" stroke="var(--ir-green)" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="var(--ir-red)" />
          <circle cx="44" cy="0" r="2.5" fill="var(--ir-red)" />
          <circle cx="0" cy="44" r="2.5" fill="var(--ir-red)" />
          <circle cx="44" cy="44" r="2.5" fill="var(--ir-red)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function PersianMedallion({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
        <svg viewBox="-110 -110 220 220" className="bt-spin-slow absolute inset-0 h-full w-full">
          <g fill="none" strokeLinejoin="round">
            <motion.circle
              r="104"
              stroke="currentColor"
              className="text-foreground/25"
              strokeWidth="0.8"
              strokeDasharray="2 5"
              {...draw(0)}
            />
            <Square size={144} rotate={0} color="var(--ir-green)" width={1.6} delay={0.1} />
            <Square size={144} rotate={45} color="var(--ir-green)" width={1.6} delay={0.3} />
            <Square size={112} rotate={22.5} color="var(--ir-red)" width={1.3} delay={0.5} />
            <Square size={112} rotate={67.5} color="var(--ir-red)" width={1.3} delay={0.7} />
            <motion.polygon
              points={starPoints(98, 80)}
              stroke="currentColor"
              className="text-foreground/20"
              strokeWidth="0.8"
              {...draw(0.9)}
            />
          </g>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <WavingFlag className="w-[34%]" />
        </div>
      </div>
    </div>
  )
}

export function Vinyl() {
  return (
    <div aria-hidden className="relative size-32 shrink-0 sm:size-36">
      <div
        className="bt-spin absolute inset-0 rounded-full shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
        style={{
          background:
            'repeating-radial-gradient(circle, #0b0b0b 0 2px, #1c1c1c 2px 3px), radial-gradient(circle, #222, #000)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_20%,rgba(255,255,255,0.14)_25%,transparent_30%_70%,rgba(255,255,255,0.1)_75%,transparent_80%)]" />
        <div className="absolute inset-[34%] grid place-items-center rounded-full bg-[var(--c)]">
          <div className="size-1.5 rounded-full bg-black" />
        </div>
      </div>
      <div className="absolute -top-2 -right-3 h-24 w-2 origin-top rotate-[8deg] transition-transform duration-700 ease-out group-hover:rotate-[26deg]">
        <div className="mx-auto size-3.5 -translate-x-[3px] rounded-full bg-muted/70" />
        <div className="mx-auto h-full w-[3px] rounded-full bg-muted/70" />
        <div className="mx-auto -mt-1 h-3 w-2 rounded-sm bg-muted" />
      </div>
    </div>
  )
}

export function Equalizer({ bars = 7 }: { bars?: number }) {
  return (
    <div aria-hidden className="flex h-6 items-end gap-[3px]">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="bt-eq block h-full w-[3px] rounded-full bg-[var(--c)]"
          style={{ animationDelay: `${(i * 137) % 900}ms`, animationDuration: `${800 + ((i * 211) % 600)}ms` }}
        />
      ))}
    </div>
  )
}

const filmFrames = [
  ['#f97316', '#7c2d12'],
  ['#22c55e', '#14532d'],
  ['#38bdf8', '#0c4a6e'],
  ['#a855f7', '#3b0764'],
  ['#facc15', '#713f12'],
  ['#f43f5e', '#4c0519'],
]

export function FilmStrip() {
  const strip = [...filmFrames, ...filmFrames]
  const holes = 'repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,0.75) 6px 12px, transparent 12px 18px)'
  return (
    <div aria-hidden className="-mx-5 -mt-5 mb-5 overflow-hidden bg-neutral-950 py-2 md:-mx-6 md:-mt-6">
      <div className="h-1.5 opacity-60" style={{ backgroundImage: holes }} />
      <div className="bt-marquee my-2 flex w-max gap-2 pl-2">
        {strip.map(([a, b], i) => (
          <div
            key={i}
            className="relative h-16 w-24 overflow-hidden rounded-sm"
            style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
          >
            <div className="absolute -bottom-3 left-2 size-10 rounded-full bg-black/25" />
            <div className="absolute top-2 right-3 size-3 rounded-full bg-white/50" />
          </div>
        ))}
      </div>
      <div className="h-1.5 opacity-60" style={{ backgroundImage: holes }} />
    </div>
  )
}

export function Barbell() {
  const plate = (x: number, height: number, extra = false) => (
    <rect
      x={x}
      y={40 - height / 2}
      width="7"
      height={height}
      rx="2"
      fill="var(--c)"
      className={extra ? 'opacity-0 transition-all duration-500 group-hover:opacity-100' : ''}
      style={extra ? { transformBox: 'fill-box', transformOrigin: 'center' } : undefined}
    />
  )
  return (
    <svg aria-hidden viewBox="0 0 200 80" className="h-20 w-full">
      <ellipse cx="100" cy="74" rx="70" ry="3" className="fill-foreground/10" />
      <g className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3">
        <rect x="14" y="38" width="172" height="4" rx="2" className="fill-muted" />
        <rect x="40" y="35" width="4" height="10" rx="1" className="fill-muted" />
        <rect x="156" y="35" width="4" height="10" rx="1" className="fill-muted" />
        {plate(46, 46)}
        {plate(55, 38)}
        {plate(64, 30, true)}
        {plate(147, 46)}
        {plate(138, 38)}
        {plate(129, 30, true)}
      </g>
    </svg>
  )
}

export function Crosshair() {
  return (
    <svg aria-hidden viewBox="-50 -50 100 100" className="size-24">
      <circle
        r="40"
        fill="none"
        stroke="var(--c)"
        strokeOpacity="0.35"
        strokeDasharray="4 6"
        className="bt-spin-rev"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle r="28" fill="none" stroke="var(--c)" strokeOpacity="0.2" />
      <g
        stroke="var(--c)"
        strokeWidth="3"
        strokeLinecap="round"
        className="transition-transform duration-300 group-hover:scale-75"
        style={{ transformBox: 'view-box', transformOrigin: 'center' }}
      >
        <line x1="0" y1="-22" x2="0" y2="-10" />
        <line x1="0" y1="22" x2="0" y2="10" />
        <line x1="-22" y1="0" x2="-10" y2="0" />
        <line x1="22" y1="0" x2="10" y2="0" />
      </g>
      <circle r="2" fill="var(--c)" />
      <g
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-200"
      >
        <line x1="-8" y1="-8" x2="-4" y2="-4" />
        <line x1="8" y1="-8" x2="4" y2="-4" />
        <line x1="-8" y1="8" x2="-4" y2="4" />
        <line x1="8" y1="8" x2="4" y2="4" />
      </g>
    </svg>
  )
}

export function Basketball() {
  return (
    <div aria-hidden className="relative flex h-24 w-20 flex-col items-center justify-end">
      <div className="bt-bounce relative z-10 size-11 origin-bottom">
        <svg viewBox="-20 -20 40 40" className="h-full w-full">
          <circle r="19" fill="#ea7a2a" />
          <g fill="none" stroke="#5a2a0a" strokeWidth="1.4">
            <circle r="19" />
            <line x1="0" y1="-19" x2="0" y2="19" />
            <line x1="-19" y1="0" x2="19" y2="0" />
            <path d="M -13 -14 Q -4 0 -13 14" />
            <path d="M 13 -14 Q 4 0 13 14" />
          </g>
        </svg>
      </div>
      <div className="bt-shadow mt-1 h-1.5 w-10 rounded-[50%] bg-foreground/40 blur-[1px]" />
    </div>
  )
}

export function PingPong() {
  return (
    <div aria-hidden className="relative h-12 w-[120px]">
      <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[var(--c)] opacity-50" />
      <div className="absolute bottom-0 left-1/2 h-4 w-[2px] -translate-x-1/2 bg-muted" />
      <div className="bt-pong absolute top-0 left-0 size-2.5 rounded-full bg-[#f97316] shadow-[0_0_10px_#f97316]" />
    </div>
  )
}

// vertical slices bobbing out of phase make the flag ripple
export function WavingFlag({ className = '' }: { className?: string }) {
  const slices = 32
  return (
    <div className={`aspect-[4/3] ${className}`}>
      <div className="flex h-full w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
        {Array.from({ length: slices }, (_, i) => (
          <div
            key={i}
            className="bt-wave relative h-full flex-1 first:rounded-l-[3px] last:rounded-r-[3px]"
            style={
              {
                '--a': `${2 + (i / slices) * 5}px`,
                animationDelay: `${-i * 0.07}s`,
                backgroundImage: 'url(/beyond/iran-flag.svg)',
                backgroundSize: `${slices * 100.4}% 100%`,
                backgroundPosition: `${(i / (slices - 1)) * 100}% 0`,
              } as CSSProperties
            }
          >
            <div className="bt-shade absolute inset-0 bg-black" style={{ animationDelay: `${-i * 0.07}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

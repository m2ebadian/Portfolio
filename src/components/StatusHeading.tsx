// src/components/StatusHeading.tsx
// Small mono heading used inside sections, with an optional pulsing "live" dot.

interface StatusHeadingProps {
  children: string
  live?: boolean // show the pulsing dot (for ongoing work)
}

function StatusHeading({ children, live = false }: StatusHeadingProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {live && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      )}
      <h3 className="font-mono text-sm uppercase tracking-widest text-accent">{children}</h3>
    </div>
  )
}

export default StatusHeading

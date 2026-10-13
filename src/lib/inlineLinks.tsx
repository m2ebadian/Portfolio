import type { ReactNode } from 'react'

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

// turns [text](url) in data strings into links
export function withLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(LINK)) {
    const [whole, label, url] = match
    const start = match.index ?? 0
    if (start > last) parts.push(text.slice(last, start))
    parts.push(
      <a
        key={start}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-[var(--c,var(--accent))] underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {label}
      </a>,
    )
    last = start + whole.length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts
}

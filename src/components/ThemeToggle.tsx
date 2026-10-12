import { useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

function ThemeToggle() {
  // Read the class the index.html script already set, so React starts in sync
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  function toggle() {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setIsDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full border border-border bg-surface p-2 text-lg text-foreground transition-colors hover:text-accent"
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  )
}

export default ThemeToggle
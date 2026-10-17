import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import type { Photo } from '../../types/beyond'
import { ease } from '../../lib/motion'

const navButton =
  'absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/75'

interface PhotoViewerProps {
  photos: Photo[]
  index: number
  direction: number
  onStep: (direction: number) => void
  onClose: () => void
}

function PhotoViewer({ photos, index, direction, onStep, onClose }: PhotoViewerProps) {
  const photo = photos[index]
  const lenis = useLenis()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }

    window.addEventListener('keydown', handleKey)
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onStep, lenis])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <figure className="relative w-full max-w-[min(90vw,72vh)]" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.caption}
              initial={{ opacity: 0, x: direction * 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -60, scale: 0.96 }}
              transition={{ duration: 0.4, ease }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white">
          <span>
            <span className="mr-2 rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
              {photo.tag}
            </span>
          </span>
          <span className="font-mono text-xs text-white/60">
            {index + 1} / {photos.length}
          </span>
        </figcaption>

        <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={`${navButton} left-2 sm:-left-14`}>
          <FiChevronLeft />
        </button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={`${navButton} right-2 sm:-right-14`}>
          <FiChevronRight />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          autoFocus
          className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <FiX />
        </button>
      </figure>
    </motion.div>
  )
}

function FoodGallery({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)

  function open(index: number) {
    setDirection(1)
    setOpenIndex(index)
  }

  const step = useCallback(
    (delta: number) => {
      setDirection(delta)
      setOpenIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length))
    },
    [photos.length],
  )

  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <>
      <div className="bt-gallery -mx-5 mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] md:-mx-6">
        <ul className="bt-marquee flex w-max gap-3 px-3" style={{ animationDuration: `${photos.length * 4.5}s` }}>
          {[...photos, ...photos].map((photo, i) => {
            const duplicate = i >= photos.length
            return (
              <li key={i} aria-hidden={duplicate || undefined}>
                <button
                  type="button"
                  tabIndex={duplicate ? -1 : 0}
                  onClick={() => open(i % photos.length)}
                  aria-label={`View photo: ${photo.caption}`}
                  className="group/photo relative block size-32 overflow-hidden rounded-xl border border-border bg-border outline-none focus-visible:ring-2 focus-visible:ring-[var(--c)] sm:size-36"
                >
                  <img
                    src={photo.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={360}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/photo:scale-110"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[9px] tracking-wider text-white uppercase backdrop-blur-sm">
                    {photo.tag}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* portaled so the tile's 3D tilt doesn't affect the fixed overlay */}
      {createPortal(
        <AnimatePresence>
          {openIndex !== null && (
            <PhotoViewer
              key="viewer"
              photos={photos}
              index={openIndex}
              direction={direction}
              onStep={step}
              onClose={close}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export default FoodGallery

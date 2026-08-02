/**
 * Lightbox.tsx
 * ──────────────────────────────────────────
 * Fullscreen immersive modal for fine-detail artwork inspection.
 * Framer Motion zoom-in / zoom-out transitions.
 * Keyboard: Esc to close, ← / → to navigate.
 *
 * Receives all artworks + pre-resolved URLs from Astro.
 * Listens for `open-lightbox` CustomEvent dispatched by ArtworkCard.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Artwork } from '../utils/sanity';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface LightboxArtwork extends Artwork {
  /** Pre-resolved display URL (grid size) */
  displayUrl: string;
  /** Pre-resolved high-res URL (lightbox size) */
  highResUrl: string;
}

interface LightboxProps {
  artworks: LightboxArtwork[];
}

/* ─────────────────────────────────────────────
   Animation variants
   ───────────────────────────────────────────── */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function Lightbox({ artworks }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const currentArtwork = isOpen ? artworks[activeIndex] : null;

  /* ── Sync with URL Hash on Mount ─────────── */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const idx = artworks.findIndex((a) => a.slug?.current === hash);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [artworks]);

  /* ── Sync URL Hash when Active Artwork Changes ── */
  useEffect(() => {
    if (isOpen && currentArtwork?.slug?.current) {
      window.history.replaceState(null, '', `#${currentArtwork.slug.current}`);
    } else if (!isOpen && window.location.hash) {
      // Only clear if the hash belongs to an artwork to avoid clearing #contact etc.
      const isArtworkHash = artworks.some(a => `#${a.slug?.current}` === window.location.hash);
      if (isArtworkHash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [isOpen, currentArtwork, artworks]);

  /* ── Navigation helpers ──────────────────── */
  const goTo = useCallback(
    (dir: -1 | 1) => {
      setActiveIndex((prev) => {
        if (prev === null) return null;
        const next = prev + dir;
        if (next < 0) return artworks.length - 1;
        if (next >= artworks.length) return 0;
        return next;
      });
    },
    [artworks.length],
  );

  const close = useCallback(() => setActiveIndex(null), []);

  /* ── Listen for open-lightbox events ─────── */
  useEffect(() => {
    function handleOpen(e: Event) {
      const { artworkId } = (e as CustomEvent<{ artworkId: string }>).detail;
      const idx = artworks.findIndex((a) => a._id === artworkId);
      if (idx !== -1) setActiveIndex(idx);
    }

    document.addEventListener('open-lightbox', handleOpen);
    return () => document.removeEventListener('open-lightbox', handleOpen);
  }, [artworks]);

  /* ── Keyboard controls + focus trap ────────── */
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowLeft':
          goTo(-1);
          break;
        case 'ArrowRight':
          goTo(1);
          break;
        case 'Tab': {
          // Focus trap (R7 — WCAG 2.4.3)
          const container = lightboxRef.current;
          if (!container) break;
          const focusable = container.querySelectorAll<HTMLElement>(
            'button, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) break;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    }

    // Lock body scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    document.addEventListener('keydown', handleKey);

    // Move focus into the lightbox
    const closeBtn = lightboxRef.current?.querySelector<HTMLElement>('.lightbox__close');
    closeBtn?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, close, goTo]);

  return (
    <AnimatePresence>
      {isOpen && currentArtwork && (
        <motion.div
          ref={lightboxRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Artwork detail view"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Backdrop click to close */}
          <div className="lightbox__backdrop" onClick={close} />

          {/* ── Close button ──────────────── */}
          <button
            className="lightbox__close"
            onClick={close}
            aria-label="Close lightbox"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* ── Nav arrows ────────────────── */}
          {artworks.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => goTo(-1)}
                aria-label="Previous artwork"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={() => goTo(1)}
                aria-label="Next artwork"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* ── Image + info ──────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArtwork._id}
              className="lightbox__content"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="lightbox__image-wrap">
                <img
                  src={currentArtwork.highResUrl}
                  alt={currentArtwork.image.alt}
                  width={currentArtwork.image.width}
                  height={currentArtwork.image.height}
                  className="lightbox__image"
                  draggable={false}
                />
              </div>

              <div className="lightbox__info">
                <h2 className="lightbox__title">{currentArtwork.title}</h2>
                <p className="lightbox__meta">
                  <span>{currentArtwork.category}</span>
                  <span className="lightbox__dot" />
                  <span>{currentArtwork.medium}</span>
                </p>
                {artworks.length > 1 && (
                  <p className="lightbox__counter">
                    {(activeIndex ?? 0) + 1} / {artworks.length}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Scoped styles ─────────────── */}
          <style>{`
            .lightbox {
              position: fixed;
              inset: 0;
              z-index: 200;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .lightbox__backdrop {
              position: absolute;
              inset: 0;
              background-color: rgba(250, 250, 250, 0.97);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
            }

            .lightbox__close {
              position: absolute;
              top: 1.5rem;
              right: 1.5rem;
              z-index: 210;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 44px;
              height: 44px;
              border: 1px solid rgba(0, 0, 0, 0.08);
              border-radius: 50%;
              background: #FFFFFF;
              color: #000000;
              cursor: pointer;
              transition: border-color 0.2s ease, color 0.2s ease;
            }

            .lightbox__close:hover {
              border-color: #7ED4E6;
              color: #7ED4E6;
            }

            /* ── Nav arrows ────────────── */
            .lightbox__nav {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 210;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              border: 1px solid rgba(0, 0, 0, 0.06);
              border-radius: 50%;
              background: #FFFFFF;
              color: #000000;
              cursor: pointer;
              transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
            }

            .lightbox__nav:hover {
              border-color: #7ED4E6;
              color: #7ED4E6;
            }

            .lightbox__nav--prev {
              left: 1.5rem;
            }

            .lightbox__nav--prev:hover {
              transform: translateY(-50%) translateX(-2px);
            }

            .lightbox__nav--next {
              right: 1.5rem;
            }

            .lightbox__nav--next:hover {
              transform: translateY(-50%) translateX(2px);
            }

            /* ── Content ───────────────── */
            .lightbox__content {
              position: relative;
              z-index: 205;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1.5rem;
              max-width: 90vw;
              max-height: 90vh;
              pointer-events: none;
            }

            .lightbox__image-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              max-height: 72vh;
              overflow: hidden;
              border-radius: 4px;
              box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.08),
                0 4px 16px rgba(0, 0, 0, 0.04);
              pointer-events: auto;
            }

            .lightbox__image {
              display: block;
              max-width: 100%;
              max-height: 72vh;
              width: auto;
              height: auto;
              object-fit: contain;
              user-select: none;
            }

            .lightbox__info {
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.4rem;
            }

            .lightbox__title {
              font-size: 1.15rem;
              font-weight: 600;
              color: #000000;
              letter-spacing: -0.01em;
            }

            .lightbox__meta {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.75rem;
              font-weight: 400;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: rgba(0, 0, 0, 0.4);
            }

            .lightbox__dot {
              display: inline-block;
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background-color: #7ED4E6;
            }

            .lightbox__counter {
              font-size: 0.68rem;
              font-weight: 500;
              letter-spacing: 0.12em;
              color: rgba(0, 0, 0, 0.25);
              margin-top: 0.15rem;
            }

            /* ── Mobile ────────────────── */
            @media (max-width: 768px) {
              .lightbox__nav {
                width: 40px;
                height: 40px;
              }

              .lightbox__nav--prev { left: 0.75rem; }
              .lightbox__nav--next { right: 0.75rem; }

              .lightbox__close {
                top: 1rem;
                right: 1rem;
                width: 40px;
                height: 40px;
              }

              .lightbox__content {
                max-width: 95vw;
              }

              .lightbox__image-wrap {
                max-height: 60vh;
              }

              .lightbox__image {
                max-height: 60vh;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

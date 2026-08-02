/**
 * BeforeAfterSlider.tsx
 * ──────────────────────────────────────────
 * Interactive before/after comparison slider.
 * Drag the vertical handle to reveal the "sketch" layer
 * underneath the "final" render.
 *
 * Uses pointer events for unified mouse + touch support.
 */
import { useCallback, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

interface BeforeAfterSliderProps {
  /** "Before" image URL (sketch / process) */
  beforeSrc: string;
  /** "After" image URL (final render) */
  afterSrc: string;
  /** Alt text for the before image */
  beforeAlt?: string;
  /** Alt text for the after image */
  afterAlt?: string;
  /** Label for the before side */
  beforeLabel?: string;
  /** Label for the after side */
  afterLabel?: string;
  /** Aspect ratio as a string, e.g. "3/2" */
  aspectRatio?: string;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Process sketch',
  afterAlt = 'Final render',
  beforeLabel = 'Sketch',
  afterLabel = 'Final',
  aspectRatio = '3/2',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percentage 0–100
  const [isDragging, setIsDragging] = useState(false);

  /* ── Compute position from pointer ───────── */
  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  /* ── Pointer handlers ────────────────────── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="ba-slider-wrapper">
      <div
        ref={containerRef}
        className={`ba-slider${isDragging ? ' ba-slider--dragging' : ''}`}
        style={{ aspectRatio }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            setPosition((p) => Math.max(0, p - 5));
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            setPosition((p) => Math.min(100, p + 5));
          }
        }}
        role="slider"
        aria-label="Before and after comparison"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        {/* ── After (full, background) ───── */}
        <div className="ba-slider__layer ba-slider__after">
          <img src={afterSrc} alt={afterAlt} draggable={false} />
        </div>

        {/* ── Before (clipped, foreground) ── */}
        <div
          className="ba-slider__layer ba-slider__before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img src={beforeSrc} alt={beforeAlt} draggable={false} />
        </div>

        {/* ── Divider handle ───────────── */}
        <div
          className="ba-slider__handle"
          style={{ left: `${position}%` }}
        >
          <div className="ba-slider__handle-line" />
          <div className="ba-slider__handle-grip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 5l-5 7 5 7" />
              <path d="M16 5l5 7-5 7" />
            </svg>
          </div>
        </div>

        {/* ── Labels ───────────────────── */}
        <span
          className="ba-slider__label ba-slider__label--before"
          style={{ opacity: position > 12 ? 1 : 0 }}
        >
          {beforeLabel}
        </span>
        <span
          className="ba-slider__label ba-slider__label--after"
          style={{ opacity: position < 88 ? 1 : 0 }}
        >
          {afterLabel}
        </span>
      </div>

      {/* ── Scoped styles ─────────────── */}
      <style>{`
        .ba-slider-wrapper {
          width: 100%;
        }
        .ba-slider {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 6px;
          cursor: ew-resize;
          user-select: none;
          touch-action: none;
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.06),
            0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .ba-slider--dragging {
          cursor: grabbing;
        }

        .ba-slider__layer {
          position: absolute;
          inset: 0;
        }

        .ba-slider__layer img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .ba-slider__after {
          z-index: 1;
        }

        .ba-slider__before {
          z-index: 2;
        }

        /* ── Handle ──────────────────── */
        .ba-slider__handle {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 3;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .ba-slider__handle-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #FFFFFF;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        }

        .ba-slider__handle-grip {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #7ED4E6;
          color: #7ED4E6;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.12),
            0 0 0 4px rgba(126, 212, 230, 0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ba-slider--dragging .ba-slider__handle-grip {
          transform: scale(1.1);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.15),
            0 0 0 6px rgba(126, 212, 230, 0.25);
        }

        /* ── Labels ──────────────────── */
        .ba-slider__label {
          position: absolute;
          bottom: 1rem;
          z-index: 4;
          padding: 0.3rem 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FFFFFF;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 100px;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .ba-slider__label--before {
          left: 1rem;
        }

        .ba-slider__label--after {
          right: 1rem;
        }

        @media (max-width: 640px) {
          .ba-slider__handle-grip {
            width: 34px;
            height: 34px;
          }

          .ba-slider__label {
            font-size: 0.62rem;
            padding: 0.25rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}

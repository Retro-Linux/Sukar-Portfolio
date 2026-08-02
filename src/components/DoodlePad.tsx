/**
 * DoodlePad.tsx
 * ──────────────────────────────────────────
 * Minimal interactive drawing canvas using HTML5 Canvas API.
 * Optimised with requestAnimationFrame point-batching and
 * pointer events for unified mouse + touch support.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */

interface ColorSwatch {
  value: string;
  label: string;
}

const COLORS: ColorSwatch[] = [
  { value: '#000000', label: 'Black' },
  { value: '#7ED4E6', label: 'Ice Blue' },
  { value: '#E74C3C', label: 'Crimson' },
  { value: '#F39C12', label: 'Amber' },
  { value: '#2ECC71', label: 'Emerald' },
  { value: '#8E44AD', label: 'Amethyst' },
];

interface BrushPreset {
  value: number;
  label: string;
}

const SIZES: BrushPreset[] = [
  { value: 2, label: 'Fine' },
  { value: 5, label: 'Medium' },
  { value: 10, label: 'Broad' },
];

interface Point {
  x: number;
  y: number;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function DoodlePad() {
  /* ── Refs ───────────────────────────────── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const pointBuffer = useRef<Point[]>([]);
  const rafPending = useRef(false);

  /* ── State (controls only — drawing uses refs) ── */
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  /* ── Canvas setup & resize ─────────────── */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    // Save current drawing before resize
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (canvas.width > 0 && canvas.height > 0 && tempCtx) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Restore previous drawing
    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
      ctx.drawImage(
        tempCanvas,
        0, 0, tempCanvas.width, tempCanvas.height,
        0, 0, rect.width, rect.height,
      );
    }

    // Set defaults
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    initCanvas();

    const onResize = () => initCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [initCanvas]);

  /* ── Coordinate helper ─────────────────── */
  function getCanvasPoint(e: React.PointerEvent): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /* ── rAF draw flush ────────────────────── */
  const flushDraw = useCallback(() => {
    const ctx = ctxRef.current;
    const points = pointBuffer.current;
    const last = lastPoint.current;
    rafPending.current = false;

    if (!ctx || points.length === 0 || !last) return;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);

    // Smooth quadratic bezier through buffered points
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const prev = i === 0 ? last : points[i - 1];
      const mid: Point = {
        x: (prev.x + pt.x) / 2,
        y: (prev.y + pt.y) / 2,
      };
      ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
    }

    // Finish to the last buffered point
    const finalPt = points[points.length - 1];
    ctx.lineTo(finalPt.x, finalPt.y);
    ctx.stroke();

    lastPoint.current = finalPt;
    pointBuffer.current = [];
  }, [brushColor, brushSize]);

  /* ── Pointer handlers ──────────────────── */
  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawing.current = true;

    const pt = getCanvasPoint(e);
    lastPoint.current = pt;
    pointBuffer.current = [];

    // Draw a dot for single clicks
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDrawing.current) return;

    const pt = getCanvasPoint(e);
    pointBuffer.current.push(pt);

    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(flushDraw);
    }
  }

  function handlePointerUp() {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    // Flush any remaining points
    if (pointBuffer.current.length > 0) {
      flushDraw();
    }
    lastPoint.current = null;
  }

  /* ── Clear ─────────────────────────────── */
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  /* ── Download ──────────────────────────── */
  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'doodle.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  /* ── Render ────────────────────────────── */
  return (
    <div className="doodle-pad">
      {/* ── Toolbar ──────────────────────── */}
      <div
        className="doodle-pad__toolbar"
        role="toolbar"
        aria-label="Drawing tools"
      >
        {/* Colour swatches */}
        <fieldset className="doodle-pad__group" role="radiogroup" aria-label="Brush colour">
          <legend className="sr-only">Brush colour</legend>
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`doodle-pad__swatch${brushColor === c.value ? ' doodle-pad__swatch--active' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setBrushColor(c.value)}
              aria-label={`${c.label} brush`}
              aria-pressed={brushColor === c.value}
              title={c.label}
            />
          ))}
        </fieldset>

        {/* Divider */}
        <span className="doodle-pad__divider" aria-hidden="true" />

        {/* Size presets */}
        <fieldset className="doodle-pad__group" role="radiogroup" aria-label="Brush size">
          <legend className="sr-only">Brush size</legend>
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`doodle-pad__size-btn${brushSize === s.value ? ' doodle-pad__size-btn--active' : ''}`}
              onClick={() => setBrushSize(s.value)}
              aria-label={`${s.label} brush (${s.value}px)`}
              aria-pressed={brushSize === s.value}
              title={s.label}
            >
              <span
                className="doodle-pad__size-dot"
                style={{ width: s.value + 4, height: s.value + 4 }}
              />
            </button>
          ))}
        </fieldset>

        {/* Divider */}
        <span className="doodle-pad__divider" aria-hidden="true" />

        {/* Actions */}
        <div className="doodle-pad__group">
          <button
            type="button"
            className="doodle-pad__action-btn"
            onClick={clearCanvas}
            aria-label="Clear canvas"
            title="Clear"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-.867 12.142A2 2 0 0116.138 20H7.862a2 2 0 01-1.995-1.858L5 6" />
            </svg>
            <span>Clear</span>
          </button>

          <button
            type="button"
            className="doodle-pad__action-btn"
            onClick={downloadCanvas}
            aria-label="Download drawing as PNG"
            title="Download"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ── Canvas ───────────────────────── */}
      <div className="doodle-pad__canvas-wrap">
        <canvas
          ref={canvasRef}
          className="doodle-pad__canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Drawing canvas"
          role="img"
        />
      </div>

      {/* ── Scoped styles ────────────────── */}
      <style>{`
        .doodle-pad {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .doodle-pad__toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.75rem 1rem;
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .doodle-pad__group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: none;
          padding: 0;
          margin: 0;
        }

        .doodle-pad__divider {
          width: 1px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        /* ── Colour swatches ──────────── */
        .doodle-pad__swatch {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.15s ease;
          outline: none;
          padding: 0;
        }

        .doodle-pad__swatch:hover {
          transform: scale(1.15);
        }

        .doodle-pad__swatch:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        .doodle-pad__swatch--active {
          border-color: #7ED4E6;
          transform: scale(1.15);
          box-shadow: 0 0 0 3px rgba(126, 212, 230, 0.25);
        }

        /* ── Size buttons ─────────────── */
        .doodle-pad__size-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
          padding: 0;
        }

        .doodle-pad__size-btn:hover {
          border-color: rgba(0, 0, 0, 0.2);
        }

        .doodle-pad__size-btn:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        .doodle-pad__size-btn--active {
          border-color: #7ED4E6;
          background-color: rgba(126, 212, 230, 0.12);
        }

        .doodle-pad__size-dot {
          display: block;
          border-radius: 50%;
          background-color: #000000;
        }

        /* ── Action buttons ───────────── */
        .doodle-pad__action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.5);
          transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .doodle-pad__action-btn:hover {
          color: #000;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .doodle-pad__action-btn:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        /* ── Canvas ───────────────────── */
        .doodle-pad__canvas-wrap {
          width: 100%;
          aspect-ratio: 3 / 2;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background-color: #FFFFFF;
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.04),
            0 1px 4px rgba(0, 0, 0, 0.02);
        }

        .doodle-pad__canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          touch-action: none;
        }

        /* ── Accessibility ────────────── */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* ── Mobile ───────────────────── */
        @media (max-width: 640px) {
          .doodle-pad__toolbar {
            gap: 0.5rem;
            padding: 0.6rem 0.75rem;
          }

          .doodle-pad__swatch {
            width: 24px;
            height: 24px;
          }

          .doodle-pad__size-btn {
            width: 28px;
            height: 28px;
          }

          .doodle-pad__canvas-wrap {
            aspect-ratio: 4 / 3;
          }
        }
      `}</style>
    </div>
  );
}

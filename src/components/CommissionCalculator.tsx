/**
 * CommissionCalculator.tsx
 * ──────────────────────────────────────────
 * Interactive pricing estimator for art commissions.
 * Selectable medium, format, and size options with
 * dynamic price calculation via React state.
 */
import { useMemo, useState } from 'react';
import { useTranslations } from '../i18n/utils';

/* ─────────────────────────────────────────────
   Pricing Data
   ───────────────────────────────────────────── */

interface Option {
  id: string;
  label: string;
  description: string;
  /** Base price or multiplier depending on group */
  value: number;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

interface CommissionCalculatorProps {
  lang?: 'en' | 'ar';
}

export default function CommissionCalculator({ lang = 'en' }: CommissionCalculatorProps) {
  const t = useTranslations(lang);

  const MEDIUMS: Option[] = [
    { id: 'pencil', label: t('commission.medium_pencil_label') || 'Pencil Sketch', description: t('commission.medium_pencil_desc') || 'Graphite or charcoal on paper', value: 80 },
    { id: 'canvas', label: t('commission.medium_canvas_label') || 'Canvas Painting', description: t('commission.medium_canvas_desc') || 'Oil or acrylic on stretched canvas', value: 200 },
    { id: 'digital', label: t('commission.medium_digital_label') || 'Digital Art', description: t('commission.medium_digital_desc') || 'Procreate or Photoshop illustration', value: 150 },
  ];

  const FORMATS: Option[] = [
    { id: 'portrait', label: t('commission.format_portrait_label') || 'Portrait / Bust', description: t('commission.format_portrait_desc') || 'Head and shoulders', value: 1 },
    { id: 'half', label: t('commission.format_half_label') || 'Half Body', description: t('commission.format_half_desc') || 'Waist-up composition', value: 1.5 },
    { id: 'full', label: t('commission.format_full_label') || 'Full Body', description: t('commission.format_full_desc') || 'Complete figure', value: 2 },
  ];

  const SIZES: Option[] = [
    { id: 'small', label: t('commission.size_small_label') || 'Small', description: t('commission.size_small_desc') || 'Up to A4 / 2000px', value: 1 },
    { id: 'medium', label: t('commission.size_medium_label') || 'Medium', description: t('commission.size_medium_desc') || 'Up to A3 / 4000px', value: 1.5 },
    { id: 'large', label: t('commission.size_large_label') || 'Large', description: t('commission.size_large_desc') || 'A2+ / 6000px+', value: 2 },
  ];

  const [medium, setMedium] = useState(MEDIUMS[0].id);
  const [format, setFormat] = useState(FORMATS[0].id);
  const [size, setSize] = useState(SIZES[0].id);

  const price = useMemo(() => {
    const base = MEDIUMS.find((m) => m.id === medium)?.value ?? 0;
    const formatMul = FORMATS.find((f) => f.id === format)?.value ?? 1;
    const sizeMul = SIZES.find((s) => s.id === size)?.value ?? 1;
    return Math.round(base * formatMul * sizeMul);
  }, [medium, format, size]);

  return (
    <div className="calc">
      <div className="calc__options">
        {/* Medium */}
        <OptionGroup
          legend={t('commission.medium_legend') || 'Medium'}
          options={MEDIUMS}
          selected={medium}
          onSelect={setMedium}
        />

        {/* Format */}
        <OptionGroup
          legend={t('commission.format_legend') || 'Format'}
          options={FORMATS}
          selected={format}
          onSelect={setFormat}
        />

        {/* Size */}
        <OptionGroup
          legend={t('commission.size_legend') || 'Size'}
          options={SIZES}
          selected={size}
          onSelect={setSize}
        />
      </div>

      {/* Price display */}
      <div className="calc__result" aria-live="polite">
        <p className="calc__result-label">{t('commission.estimated_price') || 'Estimated Price'}</p>
        <p className="calc__result-price">
          <span className="calc__result-currency">$</span>
          {price}
        </p>
        <p className="calc__result-note">
          {t('commission.price_note') || 'Final pricing may vary based on complexity and revisions.'}
        </p>
      </div>

      {/* ── Scoped styles ────────────────── */}
      <style>{`
        .calc {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          align-items: start;
        }

        .calc__options {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Option group ─────────────── */
        .calc__group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: none;
          padding: 0;
          margin: 0;
        }

        .calc__group-legend {
          font-family: var(--font-hand);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-ink);
          margin-bottom: 0.5rem;
        }

        .calc__group-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .calc__option {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.8rem 1rem;
          border: 1.5px solid var(--color-tape);
          border-radius: 4px;
          background: var(--color-paper);
          cursor: pointer;
          transition: all 0.2s var(--ease-spring);
          text-align: left;
          min-width: 0;
          flex: 1;
          box-shadow: 1px 2px 0px rgba(0,0,0,0.02);
        }

        .calc__option:hover {
          border-color: var(--color-coral);
          transform: translateY(-2px);
          box-shadow: 2px 4px 0px rgba(0,0,0,0.04);
        }

        .calc__option:focus-visible {
          outline: 2px dashed var(--color-coral);
          outline-offset: 2px;
        }

        .calc__option--active {
          border-color: var(--color-coral);
          background-color: var(--color-cream);
          box-shadow: 2px 4px 0px rgba(244, 123, 137, 0.15);
        }

        .calc__option-label {
          font-family: var(--font-hand);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-ink);
          letter-spacing: 0.02em;
        }

        .calc__option-desc {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-graphite);
        }

        /* ── Result panel ─────────────── */
        .calc__result {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2.5rem 1.5rem;
          border: 1.5px dashed var(--color-tape);
          border-radius: 4px;
          background-color: var(--color-paper);
          text-align: center;
          box-shadow: 4px 6px 0px rgba(0,0,0,0.03);
          position: sticky;
          top: 80px;
          transform: rotate(1deg);
        }

        .calc__result-label {
          font-family: var(--font-hand);
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--color-sky);
        }

        .calc__result-price {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.03em;
          line-height: 1;
          display: flex;
          align-items: flex-start;
        }

        .calc__result-currency {
          font-family: var(--font-hand);
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-coral);
          margin-inline-end: 0.15rem;
          margin-top: 0.15rem;
        }

        .calc__result-note {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-graphite);
          line-height: 1.5;
          max-width: 200px;
        }

        /* ── Responsive ───────────────── */
        @media (max-width: 768px) {
          .calc {
            grid-template-columns: 1fr;
          }

          .calc__result {
            position: static;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem 1rem;
            padding: 1.25rem;
          }

          .calc__result-label {
            width: 100%;
          }

          .calc__result-note {
            max-width: none;
          }

          .calc__group-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: Option Group
   ───────────────────────────────────────────── */

interface OptionGroupProps {
  legend: string;
  options: Option[];
  selected: string;
  onSelect: (id: string) => void;
}

function OptionGroup({ legend, options, selected, onSelect }: OptionGroupProps) {
  return (
    <fieldset className="calc__group" role="radiogroup" aria-label={legend}>
      <legend className="calc__group-legend">{legend}</legend>
      <div className="calc__group-options">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`calc__option${selected === opt.id ? ' calc__option--active' : ''}`}
            onClick={() => onSelect(opt.id)}
            aria-pressed={selected === opt.id}
            aria-label={`${opt.label} — ${opt.description}`}
          >
            <span className="calc__option-label">{opt.label}</span>
            <span className="calc__option-desc">{opt.description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

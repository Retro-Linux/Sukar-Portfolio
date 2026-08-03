/**
 * CategoryFilter.tsx
 * ──────────────────────────────────────────
 * Interactive pill-style category filter tabs.
 * Uses Framer Motion `layoutId` for a smooth sliding
 * highlight that follows the active tab.
 *
 * Communicates with the Astro MasonryGrid via a
 * CustomEvent on `document` — no shared React state needed.
 */
import { useState } from 'react';
import { useTranslations } from '../i18n/utils';
import { motion } from 'framer-motion';
import type { ArtworkCategory } from '../utils/sanity';

/* ── Types ────────────────────────────────── */

type FilterValue = 'All' | ArtworkCategory;

interface CategoryFilterProps {
  /** Optional: pre-selected category */
  initial?: FilterValue;
  /** Category counts for badge display, keyed by FilterValue */
  counts?: Partial<Record<FilterValue, number>>;
}

/* ── Constants ────────────────────────────── */

const CATEGORIES: FilterValue[] = [
  'All',
  'Sketches',
  'Paintings',
  'Digital Art',
];

/* ── Component ────────────────────────────── */

export default function CategoryFilter({
  initial = 'All',
  counts,
  lang = 'en',
}: CategoryFilterProps) {
  const t = useTranslations(lang);
  const [active, setActive] = useState<FilterValue>(initial);

  function handleSelect(category: FilterValue): void {
    setActive(category);

    // Dispatch a custom event so the Astro masonry grid can react
    document.dispatchEvent(
      new CustomEvent<{ category: FilterValue }>('category-change', {
        detail: { category },
      }),
    );
  }

  const getLabel = (cat: FilterValue) => {
    if (cat === 'All') return t('gallery.filter_all');
    if (cat === 'Sketches') return t('gallery.filter_sketches');
    if (cat === 'Paintings') return t('gallery.filter_paintings');
    if (cat === 'Digital Art') return t('gallery.filter_digital_art');
    return cat;
  };

  return (
    <div className="category-filter" role="tablist" aria-label="Filter artworks by category">
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        const count = counts?.[cat];

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            className={`category-filter__tab${isActive ? ' category-filter__tab--active' : ''}`}
            onClick={() => handleSelect(cat)}
            type="button"
          >
            {/* Sliding pill highlight */}
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="category-filter__pill"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            <span className="category-filter__icon" aria-hidden="true">
              {cat === 'All' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              )}
              {cat === 'Sketches' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              )}
              {cat === 'Paintings' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              )}
              {cat === 'Digital Art' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              )}
            </span>

            <span className="category-filter__label">{getLabel(cat)}</span>

            {count !== undefined && (
              <span className="category-filter__count"><bdi>{count}</bdi></span>
            )}
          </button>
        );
      })}

      {/* ─── Scoped styles ─────────────────── */}
      <style>{`
        .category-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-filter__tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.25rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 100px;
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-graphite);
          transition: color 0.25s ease, border-color 0.25s ease;
          white-space: nowrap;
        }

        .category-filter__tab:hover {
          color: var(--color-ink);
          border-color: var(--color-ink);
        }

        .category-filter__tab--active {
          color: var(--color-ink);
          border-color: transparent;
        }

        .category-filter__pill {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background-color: #7ED4E633;
          border: 1px solid #7ED4E6;
          z-index: -1;
        }

        .category-filter__label {
          position: relative;
          z-index: 1;
        }

        .category-filter__count {
          position: relative;
          z-index: 1;
          font-size: 0.68rem;
          font-weight: 400;
          color: var(--color-graphite);
          opacity: 0.7;
        }

        .category-filter__tab--active .category-filter__count {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

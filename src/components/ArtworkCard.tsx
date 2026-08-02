/**
 * ArtworkCard.tsx
 * ──────────────────────────────────────────
 * Individual artwork card rendered inside the masonry grid.
 * Uses Framer Motion for a subtle hover scale + shadow lift.
 *
 * Styles live in MasonryGrid.astro (Astro-scoped :global)
 * to avoid duplicating <style> tags per card instance.
 */
import { motion } from 'framer-motion';
import { resolveImageUrl, type Artwork } from '../utils/sanity';

interface ArtworkCardProps {
  artwork: Artwork;
  /** Resolved display URL (already transformed via Cloudinary or raw) */
  displayUrl: string;
}

export default function ArtworkCard({ artwork, displayUrl }: ArtworkCardProps) {
  const { title, category, medium, image } = artwork;
  const aspectRatio = image.width / image.height;

  const src400 = resolveImageUrl(image, 400);
  const src800 = resolveImageUrl(image, 800);
  const src1200 = resolveImageUrl(image, 1200);
  const srcSet = `${src400} 400w, ${src800} 800w, ${src1200} 1200w`;

  /** Dispatch event to open the Lightbox with this artwork */
  function handleClick(): void {
    document.dispatchEvent(
      new CustomEvent('open-lightbox', {
        detail: { artworkId: artwork._id },
      }),
    );
  }

  return (
    <motion.article
      className="artwork-card"
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'tween',
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} in detail`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="artwork-card__image-wrap">
        <img
          src={displayUrl}
          srcSet={srcSet}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ aspectRatio: `${aspectRatio}` }}
          className="artwork-card__image"
        />
      </div>

      {/* Overlay info — visible on hover */}
      <div className="artwork-card__overlay">
        <h3 className="artwork-card__title">{title}</h3>
        <p className="artwork-card__meta">
          <span className="artwork-card__category">{category}</span>
          <span className="artwork-card__divider">·</span>
          <span className="artwork-card__medium">{medium}</span>
        </p>
      </div>
    </motion.article>
  );
}

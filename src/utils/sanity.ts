/**
 * sanity.ts
 * ──────────────────────────────────────────
 * Sanity client, TypeScript schemas, GROQ query helpers,
 * and development sample data.
 */
import { createClient, type ClientConfig } from '@sanity/client';

/* ─────────────────────────────────────────────
   Type Definitions
   ───────────────────────────────────────────── */

/** Allowed gallery categories */
export type ArtworkCategory = 'Sketches' | 'Paintings' | 'Digital Art';

export interface ArtworkImage {
  /** Sanity image URL */
  url: string;
  /** Intrinsic width in pixels */
  width: number;
  /** Intrinsic height in pixels */
  height: number;
  /** Accessible alt text */
  alt: string;
}

/** A single artwork document (mirrors the Sanity schema) */
export interface Artwork {
  _id: string;
  title: string;
  title_ar?: string;
  category: ArtworkCategory;
  /** Whether this artwork is pinned to the hero section */
  isFeatured?: boolean;
  year?: string;
  description?: string;
  description_ar?: string;
  likes: number;
  image: ArtworkImage;
  /** URL-friendly identifier */
  slug?: { current: string };
  /** e.g. "Oil on canvas", "Graphite on paper", "Procreate" */
  medium: string;
  medium_ar?: string;
}

/* ─────────────────────────────────────────────
   Sanity Client
   ───────────────────────────────────────────── */

const SANITY_PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const SANITY_DATASET = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

/**
 * Lazily create the Sanity client — only when a project ID is configured.
 * Returns `null` when Sanity env vars are missing (dev / fallback mode).
 */
function getSanityClient() {
  if (!SANITY_PROJECT_ID) return null;

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: true,
  } satisfies ClientConfig);
}

/* ─────────────────────────────────────────────
   GROQ Queries
   ───────────────────────────────────────────── */

const ARTWORK_QUERY = /* groq */ `
  *[_type == "artwork"] | order(_createdAt desc) {
    _id,
    title,
    title_ar,
    category,
    isFeatured,
    year,
    description,
    description_ar,
    "likes": coalesce(likes, 0),
    "image": {
      "url": image.asset->url,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height,
      "alt": coalesce(image.alt, title)
    },
    slug,
    medium,
    medium_ar
  }
`;

/**
 * Fetch all artworks from Sanity.
 * Falls back to sample data when Sanity is not configured.
 */
export async function getArtworks(): Promise<Artwork[]> {
  const client = getSanityClient();

  if (!client) {
    console.info('[sanity] No project ID configured — using sample data.');
    return sampleArtworks;
  }

  try {
    const results = await client.fetch<Artwork[]>(ARTWORK_QUERY);
    return results;
  } catch (error) {
    console.error('[sanity] Fetch failed, using sample data:', error);
    return sampleArtworks;
  }
}

export function resolveImageUrl(
  image: ArtworkImage,
  width: number = 800,
): string {
  // Use Sanity's CDN query parameters for aggressive optimization
  return `${image.url}?w=${width}&auto=format&fit=max&q=75`;
}

/* ─────────────────────────────────────────────
   Sample Data (development / fallback)
   ───────────────────────────────────────────── */

const sampleArtworks: Artwork[] = [
  {
    _id: 'art-001',
    title: 'Solitude in Graphite',
    category: 'Sketches',
    slug: { current: 'solitude-in-graphite' },
    image: {
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=900&fit=crop',
      width: 600,
      height: 900,
      alt: 'Detailed graphite sketch of a solitary figure',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-002',
    title: 'Amber Horizons',
    category: 'Paintings',
    slug: { current: 'amber-horizons' },
    image: {
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&h=600&fit=crop',
      width: 900,
      height: 600,
      alt: 'Abstract oil painting with warm amber tones',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-003',
    title: 'Neon Bloom',
    category: 'Digital Art',
    slug: { current: 'neon-bloom' },
    image: {
      url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=700&h=700&fit=crop',
      width: 700,
      height: 700,
      alt: 'Vibrant digital artwork with neon floral motifs',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-004',
    title: 'Study of Hands',
    category: 'Sketches',
    slug: { current: 'study-of-hands' },
    image: {
      url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&h=800&fit=crop',
      width: 600,
      height: 800,
      alt: 'Anatomical sketch study of hands in charcoal',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-005',
    title: 'Cerulean Drift',
    category: 'Paintings',
    slug: { current: 'cerulean-drift' },
    image: {
      url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=700&h=950&fit=crop',
      width: 700,
      height: 950,
      alt: 'Abstract painting with flowing cerulean blue forms',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-006',
    title: 'Pixel Decay',
    category: 'Digital Art',
    slug: { current: 'pixel-decay' },
    image: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
      width: 800,
      height: 600,
      alt: 'Glitch art with pixel distortion effects',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-007',
    title: 'Urban Contours',
    category: 'Sketches',
    slug: { current: 'urban-contours' },
    image: {
      url: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&h=1100&fit=crop',
      width: 800,
      height: 1100,
      alt: 'Ink sketch of urban architecture and contours',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-008',
    title: 'Vermillion Surge',
    category: 'Paintings',
    slug: { current: 'vermillion-surge' },
    image: {
      url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=900&h=700&fit=crop',
      width: 900,
      height: 700,
      alt: 'Expressionist painting with bold vermillion strokes',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
  {
    _id: 'art-009',
    title: 'Synthetic Dreams',
    category: 'Digital Art',
    slug: { current: 'synthetic-dreams' },
    image: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=650&h=900&fit=crop',
      width: 650,
      height: 900,
      alt: 'Surreal digital composition with dreamlike elements',
    },
    medium: '',
    likes: 0,
    year: '2024',
    description: 'Sample description.',
  },
];

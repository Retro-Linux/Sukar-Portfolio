/**
 * cloudinary.ts
 * ──────────────────────────────────────────
 * Cloudinary URL builder with automatic format,
 * quality, and responsive width transforms.
 */

export interface CloudinaryTransformOptions {
  /** Desired display width in pixels */
  width?: number;
  /** Desired display height in pixels */
  height?: number;
  /** Quality: 'auto', or a number 1–100 */
  quality?: 'auto' | number;
  /** Format: 'auto' (WebP/AVIF negotiation), 'webp', 'avif', 'jpg', 'png' */
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  /** Crop mode */
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  /** Gravity for cropping */
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

/** Your Cloudinary cloud name — override via env */
const CLOUD_NAME =
  import.meta.env.PUBLIC_CLOUDINARY_CLOUD ?? 'demo';

/**
 * Build a Cloudinary delivery URL with transforms.
 *
 * @example
 * cloudinaryUrl('portfolio/sketch-01', { width: 800, quality: 'auto', format: 'auto' })
 * // => "https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/portfolio/sketch-01"
 */
export function cloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const transforms: string[] = [];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);

  const transformStr = transforms.length > 0 ? `${transforms.join(',')}/` : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`;
}


/**
 * Lightbox.tsx
 * ──────────────────────────────────────────
 * Advanced Fullscreen Lightbox with gestures, zooming, and API integration.
 */
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Artwork } from '../utils/sanity';

export interface LightboxArtwork extends Artwork {
  displayUrl: string;
  highResUrl: string;
}

interface LightboxProps {
  artworks: LightboxArtwork[];
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Lightbox({ artworks }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, number>>({});
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState<string[]>([]);

  const isOpen = activeIndex !== null;
  const currentArtwork = isOpen ? artworks[activeIndex] : null;

  /* ── URL Hash Sync ─────────── */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const idx = artworks.findIndex((a) => a.slug?.current === hash);
    if (idx !== -1) setActiveIndex(idx);
  }, [artworks]);

  useEffect(() => {
    if (isOpen && currentArtwork?.slug?.current) {
      window.history.replaceState(null, '', `#${currentArtwork.slug.current}`);
    } else if (!isOpen && window.location.hash) {
      const isArtworkHash = artworks.some(a => `#${a.slug?.current}` === window.location.hash);
      if (isArtworkHash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [isOpen, currentArtwork, artworks]);

  /* ── LocalStorage Sync ──────── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sukar_liked_artworks');
        if (stored) setLocalLikes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse local likes', e);
      }
    }
  }, []);

  /* ── Navigation ──────────────────── */
  const goTo = useCallback(
    (dir: -1 | 1) => {
      setIsZoomed(false); // Reset zoom on navigation
      setActiveIndex((prev) => {
        if (prev === null) return null;
        const next = prev + dir;
        if (next < 0) return artworks.length - 1;
        if (next >= artworks.length) return 0;
        return next;
      });
    },
    [artworks.length]
  );

  const close = useCallback(() => {
    setIsZoomed(false);
    setActiveIndex(null);
  }, []);

  /* ── Listen for Events ─────── */
  useEffect(() => {
    function handleOpen(e: Event) {
      const { artworkId } = (e as CustomEvent<{ artworkId: string }>).detail;
      const idx = artworks.findIndex((a) => a._id === artworkId);
      if (idx !== -1) setActiveIndex(idx);
    }
    document.addEventListener('open-lightbox', handleOpen);
    return () => document.removeEventListener('open-lightbox', handleOpen);
  }, [artworks]);

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
      }
    }
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, close, goTo]);

  /* ── Actions ─────────────── */
  const handleLike = async () => {
    if (!currentArtwork || isLiking) return;
    
    // Prevent multiple likes per user
    if (localLikes.includes(currentArtwork._id)) return;

    setIsLiking(true);
    
    // Optimistic UI update
    const updatedLocalLikes = [...localLikes, currentArtwork._id];
    setLocalLikes(updatedLocalLikes);
    localStorage.setItem('sukar_liked_artworks', JSON.stringify(updatedLocalLikes));
    
    setLikedMap(prev => ({
      ...prev,
      [currentArtwork._id]: (prev[currentArtwork._id] || currentArtwork.likes || 0) + 1
    }));

    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: currentArtwork._id })
      });
    } catch (err) {
      console.error('Failed to like artwork', err);
      // Revert on failure
      const revertedLocal = localLikes.filter(id => id !== currentArtwork._id);
      setLocalLikes(revertedLocal);
      localStorage.setItem('sukar_liked_artworks', JSON.stringify(revertedLocal));
      
      setLikedMap(prev => ({
        ...prev,
        [currentArtwork._id]: (prev[currentArtwork._id] || 1) - 1
      }));
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (!currentArtwork || !navigator.share) return;
    try {
      await navigator.share({
        title: currentArtwork.title,
        text: `Check out ${currentArtwork.title} by the artist!`,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Share canceled or failed', err);
    }
  };

  const handleDragEnd = (_e: any, { offset }: any) => {
    if (isZoomed) return; // Don't swipe image to next if zoomed in
    const swipe = offset.x;
    if (swipe < -50) goTo(1);
    else if (swipe > 50) goTo(-1);
  };

  return (
    <AnimatePresence>
      {isOpen && currentArtwork && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ backgroundColor: '#2a2826' }} // Warm dark charcoal
        >
          {/* Close Area / Background Click */}
          <div className="absolute inset-0" onClick={close} />

          {/* Top Bar: Counter & Close */}
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white/80 z-20 pointer-events-none">
            <span className="text-sm font-medium tracking-widest uppercase">
              {activeIndex! + 1} / {artworks.length}
            </span>
            <button
              onClick={close}
              className="p-2 hover:text-white transition-colors pointer-events-auto"
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goTo(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur transition-all z-20 hidden md:block"
            aria-label="Previous image"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Container with Gestures & Zoom */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 z-10 pointer-events-none">
            
            {/* The Image */}
            <motion.div 
              className="relative max-w-full md:max-w-[70%] max-h-[70vh] md:max-h-full flex justify-center items-center pointer-events-auto cursor-zoom-in shrink-1"
              drag={isZoomed ? true : "x"}
              dragConstraints={isZoomed ? undefined : { left: 0, right: 0 }}
              dragElastic={isZoomed ? 0.2 : 0.8}
              onDragEnd={handleDragEnd}
              onClick={() => setIsZoomed(!isZoomed)}
              animate={{ scale: isZoomed ? 1.8 : 1, cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <img
                key={currentArtwork._id}
                src={currentArtwork.highResUrl}
                alt={currentArtwork.title}
                draggable={false}
                className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain drop-shadow-2xl rounded-sm"
              />
            </motion.div>

            {/* Details Panel */}
            <motion.div 
              className="w-full md:w-80 bg-[#1e1c1b]/80 backdrop-blur-md p-6 rounded-xl border border-white/10 text-white/90 shadow-xl pointer-events-auto shrink-0 self-end md:self-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif mb-1">{currentArtwork.title}</h2>
              <div className="flex items-center gap-2 text-sm text-white/60 mb-4 font-mono uppercase tracking-wider">
                <span>{currentArtwork.category}</span>
                {currentArtwork.year && (
                  <>
                    <span>&middot;</span>
                    <span>{currentArtwork.year}</span>
                  </>
                )}
              </div>
              
              <p className="text-sm font-medium text-white/80 mb-6 italic border-l-2 border-[#d4853a] pl-3">
                {currentArtwork.medium}
              </p>

              {currentArtwork.description && (
                <p className="text-sm text-white/70 leading-relaxed mb-6 whitespace-pre-wrap">
                  {currentArtwork.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <motion.button 
                  onClick={handleLike}
                  whileTap={!localLikes.includes(currentArtwork._id) ? { scale: 0.9 } : {}}
                  disabled={localLikes.includes(currentArtwork._id)}
                  className={`flex items-center gap-2 transition-colors ${
                    localLikes.includes(currentArtwork._id) 
                      ? 'text-[#d4853a] cursor-default' 
                      : 'text-white/50 hover:text-white'
                  }`}
                  aria-label={localLikes.includes(currentArtwork._id) ? "Already liked" : "Like this artwork"}
                >
                  <motion.svg 
                    animate={isLiking ? { scale: [1, 1.4, 1] } : {}} 
                    width="20" height="20" fill={localLikes.includes(currentArtwork._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </motion.svg>
                  <span className="font-mono text-sm font-semibold">
                    {likedMap[currentArtwork._id] !== undefined 
                      ? likedMap[currentArtwork._id] 
                      : (currentArtwork.likes || 0)}
                  </span>
                </motion.button>

                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors ml-auto text-sm font-medium"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12" />
                    </svg>
                    Share
                  </button>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goTo(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur transition-all z-20 hidden md:block"
            aria-label="Next image"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { TravelImageItem } from '../../assets/travelImages';

export interface TravelImageCarouselProps {
  images: TravelImageItem[];
  intervalMs?: number; // Default 7000ms (7s)
  aspectRatio?: '16/9' | '4/3' | '21/9' | '3/2' | 'square' | 'auto';
  className?: string;
  imageClassName?: string;
  showOverlay?: boolean;
  overlayGradient?: string;
  showIndicators?: boolean;
  showCaption?: boolean;
  pauseOnHover?: boolean;
  enableZoom?: boolean;
  priority?: boolean;
}

export const TravelImageCarousel: React.FC<TravelImageCarouselProps> = ({
  images,
  intervalMs = 7000,
  aspectRatio = '16/9',
  className,
  imageClassName,
  showOverlay = true,
  overlayGradient = 'from-neutral-950/80 via-neutral-950/30 to-transparent',
  showIndicators = true,
  showCaption = true,
  pauseOnHover = true,
  enableZoom = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check browser tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Preload next image
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const nextImg = images[nextIndex];
      if (nextImg?.src) {
        const img = new Image();
        img.src = nextImg.src;
      }
    }
  }, [currentIndex, images]);

  // Next slide helper
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Timer loop with pause on hover / tab visibility
  useEffect(() => {
    if (images.length <= 1 || isPaused || isTabHidden || prefersReducedMotion) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      goToNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [images.length, intervalMs, isPaused, isTabHidden, prefersReducedMotion, goToNext]);

  const aspectRatioClass = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '21/9': 'aspect-[21/9]',
    '3/2': 'aspect-[3/2]',
    'square': 'aspect-square',
    'auto': '',
  }[aspectRatio];

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Travel photography showcase"
      className={cn(
        'relative overflow-hidden select-none bg-neutral-900',
        aspectRatioClass,
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Stacked Images for Smooth Crossfade & Scale */}
      {images.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={`${item.src}-${index}`}
            className={cn(
              'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
              prefersReducedMotion ? 'transition-none' : ''
            )}
            aria-hidden={!isActive}
          >
            <img
              src={item.src}
              alt={item.alt}
              className={cn(
                'w-full h-full object-cover object-center',
                enableZoom && !prefersReducedMotion && isActive
                  ? 'scale-105 transition-transform duration-[7000ms] ease-out'
                  : 'scale-100',
                imageClassName
              )}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}

      {/* Cinematic Gradient Overlays */}
      {showOverlay && (
        <div
          className={cn(
            'absolute inset-0 z-20 pointer-events-none bg-gradient-to-t',
            overlayGradient
          )}
        />
      )}

      {/* Editorial Title / Subtitle Overlay */}
      {showCaption && currentImage && (currentImage.title || currentImage.subtitle) && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 max-w-lg text-white pointer-events-none">
          {currentImage.title && (
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-emerald-400 drop-shadow-sm">
              {currentImage.title}
            </p>
          )}
          {currentImage.subtitle && (
            <p className="text-sm sm:text-base text-neutral-200 mt-0.5 line-clamp-2 drop-shadow-md">
              {currentImage.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Minimalist Progress Indicators */}
      {showIndicators && images.length > 1 && (
        <div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-1.5 bg-neutral-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-neutral-700/50"
          role="tablist"
          aria-label="Travel images navigation"
        >
          {images.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1} of ${images.length}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                  isActive
                    ? 'w-6 bg-emerald-400'
                    : 'w-1.5 bg-neutral-500 hover:bg-neutral-300'
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Re-export as AutoImage for flexible naming
export const AutoImage = TravelImageCarousel;

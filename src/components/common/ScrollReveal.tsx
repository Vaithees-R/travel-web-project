import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export interface ScrollRevealProps {
  children?: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  direction?: 'up' | 'none';
  as?: React.ElementType;
}

/**
 * ScrollReveal: Lightweight IntersectionObserver-based entrance reveal component.
 * Triggers entrance animation once when the element scrolls into view.
 * Respects prefers-reduced-motion for complete accessibility compliance.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delayMs = 0,
  durationMs = 650,
  className,
  direction = 'up',
  as: Component = 'div',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 1. Accessibility: check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    // 2. Fallback if IntersectionObserver is not available in environment
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            // One-time entrance: unobserve immediately
            if (elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const target = elementRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  return (
    <Component
      ref={elementRef}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
      }}
      className={cn(
        'transition-all ease-[cubic-bezier(0.16,1,0.3,1)]',
        isRevealed
          ? 'opacity-100 translate-y-0'
          : direction === 'up'
          ? 'opacity-0 translate-y-4'
          : 'opacity-0',
        className
      )}
    >
      {children}
    </Component>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { breakpoints } from '@hr-dashboard/design-tokens';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.tablet - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);
  const isWide = useMediaQuery(`(min-width: ${breakpoints.wide}px)`);

  return { isMobile, isTablet, isDesktop, isWide };
}

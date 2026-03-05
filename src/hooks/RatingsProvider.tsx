'use client';

import { usePathname } from 'next/navigation';
import { createContext, useRef, useState } from 'react';
import { LEVELS } from '@/lib/levels';
import { decodeRatings, encodeRatings } from '@/lib/ratingsEncoding';
import type { LevelKeys } from '@/types/levels';

interface RatingsContextType {
  ratings: Record<string, number>;
  setRating: (param: string, value: number) => void;
}

export const RatingsContext = createContext<RatingsContextType>({
  ratings: {},
  setRating: () => {
    throw new Error('setRating called outside RatingsProvider');
  },
});

interface Props {
  children: React.ReactNode;
}

function isValidLevel(level: string): level is LevelKeys {
  return level in LEVELS;
}

function parsePathname(pathname: string): {
  level: LevelKeys | null;
  encoded: string | null;
} {
  const parts = pathname.split('/').filter(Boolean);
  const rawLevel = parts[0];
  const level = rawLevel && isValidLevel(rawLevel) ? rawLevel : null;
  const encoded = parts[1] ?? null;
  return { level, encoded };
}

function ratingsFromPathname(pathname: string): Record<string, number> {
  const { level, encoded } = parsePathname(pathname);
  if (!level || !encoded) return {};
  return decodeRatings(encoded, level);
}

export default function RatingsProvider({ children }: Props): React.ReactNode {
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [ratings, setRatings] = useState<Record<string, number>>(() =>
    ratingsFromPathname(pathname),
  );

  // Keep a ref in sync so setRating can read current ratings without a
  // functional updater. Calling replaceState inside a functional updater is a
  // side effect inside what React expects to be a pure function; React may
  // invoke updaters more than once (e.g., in Strict Mode), which would fire
  // replaceState multiple times for a single user action.
  const ratingsRef = useRef(ratings);
  ratingsRef.current = ratings;

  // Sync state on actual navigations (back/forward, level switch, reset).
  // Runs during render to avoid showing stale state after navigation.
  // Note: replaceState changes do not update usePathname(), so this only
  // triggers on real Next.js navigations — which is the intended behavior.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setRatings(ratingsFromPathname(pathname));
  }

  function setRating(param: string, value: number): void {
    const { level } = parsePathname(window.location.pathname);
    if (!level) {
      console.error(
        '[RatingsProvider] setRating called with no valid level in pathname.',
        {
          pathname: window.location.pathname,
          param,
          value,
        },
      );
      return;
    }

    const next = { ...ratingsRef.current, [param]: value };
    const encoded = encodeRatings(next, level);
    try {
      // Preserve Next.js internal history state while updating the URL.
      window.history.replaceState(
        window.history.state,
        '',
        `/${level}/${encoded}`,
      );
    } catch (err) {
      console.error(
        '[RatingsProvider] replaceState failed; URL may be out of sync.',
        err,
      );
    }
    setRatings(next);
  }

  return (
    <RatingsContext.Provider value={{ ratings, setRating }}>
      {children}
    </RatingsContext.Provider>
  );
}

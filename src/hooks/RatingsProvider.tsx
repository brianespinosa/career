'use client';

import { useParams, usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { buildRatingPath, parseRatings } from '@/lib/ratingPath';

type RatingsContextValue = {
  ratingsMap: Record<string, number>;
  setRating: (param: string, value: number) => void;
};

const RatingsContext = createContext<RatingsContextValue>({
  ratingsMap: {},
  setRating: () => {},
});

/**
 * Holds ratings in React state and syncs the URL via replaceState.
 * This avoids triggering a router navigation on every rating change,
 * which would interrupt Framer Motion animations.
 */
export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const level = params.level as string;

  const [ratingsMap, setRatingsMap] = useState(() =>
    parseRatings(level, (params.ratings as string[]) ?? []),
  );

  // Re-sync when the router navigates (level change, reset, back/forward).
  // window.history.replaceState does not update usePathname, so rating
  // changes do NOT trigger this effect.
  // biome-ignore lint/correctness/useExhaustiveDependencies: params updates with pathname; intentional omission to avoid firing on every render
  useEffect(() => {
    setRatingsMap(parseRatings(level, (params.ratings as string[]) ?? []));
  }, [pathname]);

  const setRating = (param: string, value: number) => {
    setRatingsMap((current) => {
      const next = { ...current, [param]: value };
      window.history.replaceState(null, '', buildRatingPath(level, next));
      return next;
    });
  };

  return (
    <RatingsContext.Provider value={{ ratingsMap, setRating }}>
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatingsMap(): Record<string, number> {
  return useContext(RatingsContext).ratingsMap;
}

export function useSetRating(): (param: string, value: number) => void {
  return useContext(RatingsContext).setRating;
}

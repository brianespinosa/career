'use client';

import { useParams } from 'next/navigation';

import { parseRatings } from '@/lib/ratingPath';

export default function useRatingsMap(): Record<string, number> {
  const params = useParams();
  return parseRatings(
    params.level as string,
    (params.ratings as string[]) ?? [],
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';

import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

const DEFAULT_LEVEL = Object.keys(LEVELS)[0] as LevelKeys;

type CareerParamHook = [LevelKeys, (value: LevelKeys) => void];

export default function useCareerParam(): CareerParamHook {
  const params = useParams();
  const router = useRouter();
  const raw = params.level;
  // Fall back to the default level when the route has no [level] segment or
  // the value is not a valid key (e.g. layout rendering on a 404 route).
  const level =
    typeof raw === 'string' && raw in LEVELS
      ? (raw as LevelKeys)
      : DEFAULT_LEVEL;
  const setLevel = (newLevel: LevelKeys) => router.push(`/${newLevel}`);

  return [level, setLevel];
}

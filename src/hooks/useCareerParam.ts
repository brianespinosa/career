'use client';

import { useParams, useRouter } from 'next/navigation';

import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

type CareerParamHook = [LevelKeys | null, (value: LevelKeys) => void];

export default function useCareerParam(): CareerParamHook {
  const params = useParams();
  const router = useRouter();
  const raw = params.level;
  const level =
    typeof raw === 'string' && raw in LEVELS ? (raw as LevelKeys) : null;
  const setLevel = (newLevel: LevelKeys) => router.push(`/${newLevel}`);

  return [level, setLevel];
}

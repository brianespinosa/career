'use client';

import { useParams, useRouter } from 'next/navigation';
import type { LevelKeys } from '@/types/levels';

type CareerParamHook = [LevelKeys, (value: LevelKeys) => void];

export default function useCareerParam(): CareerParamHook {
  const params = useParams();
  const router = useRouter();
  const level = params.level as LevelKeys;
  const setLevel = (newLevel: LevelKeys) => router.push(`/${newLevel}`);

  return [level, setLevel];
}

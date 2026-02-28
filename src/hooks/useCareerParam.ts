'use client';

import { useParams, useRouter } from 'next/navigation';

import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

type CareerParamHook = [LevelKeys, (newLevel: string) => void];

export default function useCareerParam(): CareerParamHook {
  const params = useParams();
  const router = useRouter();

  const defaultLevel = Object.keys(LEVELS)[0] as LevelKeys;
  const career = (params.level as LevelKeys) ?? defaultLevel;

  const setCareer = (newLevel: string) => {
    router.push(`/${newLevel}`);
  };

  return [career, setCareer];
}

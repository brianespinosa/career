'use client';

import { useQueryState } from 'nuqs';
import type { Dispatch, SetStateAction } from 'react';

import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

type CareerParamHook = [LevelKeys, Dispatch<SetStateAction<string>>];

export default function useCareerParam(): CareerParamHook {
  const [career, setCareer] = useQueryState('lvl', {
    defaultValue: Object.keys(LEVELS)[0],
    clearOnDefault: false,
  });

  return [career as LevelKeys, setCareer];
}

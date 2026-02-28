'use client';

import { useQueryState } from 'nuqs';
import type { Dispatch, SetStateAction } from 'react';

import EM from '@/data/em.json';
import IC from '@/data/ic.json';
import type { LevelKeys } from '@/types/levels';

type CareerParamHook = [LevelKeys, Dispatch<SetStateAction<string>>];

const LEVELS = { ...IC, ...EM };

export default function useCareerParam(): CareerParamHook {
  const [career, setCareer] = useQueryState('lvl', {
    defaultValue: Object.keys(LEVELS)[0],
    clearOnDefault: false,
  });

  return [career as LevelKeys, setCareer];
}

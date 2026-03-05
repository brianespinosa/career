'use client';

import { useParams } from 'next/navigation';

import { LEVELS } from '@/lib/levels';

import CareerSelect from './CareerSelect';
import ResetButton from './ResetButton';

export default function HeaderControls(): React.ReactNode {
  const params = useParams();
  const level = params.level;
  if (typeof level !== 'string' || !(level in LEVELS)) return null;
  return (
    <>
      <CareerSelect />
      <ResetButton />
    </>
  );
}

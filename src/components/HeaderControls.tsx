'use client';

import CareerSelect from './CareerSelect';
import ResetButton from './ResetButton';

export default function HeaderControls(): React.ReactNode {
  return (
    <>
      <CareerSelect />
      <ResetButton />
    </>
  );
}

import { Metadata } from 'next';

import CareerThemes from '@/components/CareerThemes';

export const metadata: Metadata = {
  title: 'Career Ladder',
};

export default function Home() {
  return (
    <>
      <CareerThemes />
    </>
  );
}

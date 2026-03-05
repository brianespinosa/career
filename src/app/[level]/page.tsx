import { notFound } from 'next/navigation';
import CareerThemes from '@/components/CareerThemes';
import { LEVELS } from '@/lib/levels';

interface Props {
  params: Promise<{ level: string }>;
}

export default async function LevelPage({ params }: Props) {
  const { level } = await params;
  if (!(level in LEVELS)) notFound();
  return <CareerThemes />;
}

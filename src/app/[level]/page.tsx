import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CareerThemes from '@/components/CareerThemes';
import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

interface Props {
  params: Promise<{ level: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  if (!(level in LEVELS)) return {};
  const levelData = LEVELS[level as LevelKeys];
  return {
    title: levelData.name,
    description: `Self-assessment for [${level}] ${levelData.name} on the engineering career ladder.`,
  };
}

export default async function LevelPage({ params }: Props) {
  const { level } = await params;
  if (!(level in LEVELS)) notFound();
  return <CareerThemes />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CareerThemes from '@/components/CareerThemes';
import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

interface Props {
  params: Promise<{ level: string; encoded: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  if (!(level in LEVELS)) return {};
  return { title: LEVELS[level as LevelKeys].name };
}

export default async function EncodedPage({ params }: Props) {
  const { level } = await params;
  if (!(level in LEVELS)) notFound();
  return <CareerThemes />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CareerThemes from '@/components/CareerThemes';
import { LEVELS } from '@/lib/levels';
import { formatRatingDate } from '@/lib/siteConfig';
import type { LevelKeys } from '@/types/levels';

interface Props {
  params: Promise<{ level: string; encoded: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  if (!(level in LEVELS)) return {};
  const levelData = LEVELS[level as LevelKeys];
  // Rating Date intentionally reflects server render time, not when the user
  // originally set their ratings — the encoded URL carries no timestamp.
  // The intended workflow is for users to share their rated URL with themselves
  // in a personal Slack conversation. Each unfurl appears as a dated snapshot,
  // creating a lightweight personal history of ratings without any server-side
  // state or user accounts.
  const date = formatRatingDate();
  return {
    title: levelData.name,
    description: `Self-assessment ratings for [${level}] ${levelData.name} on the engineering career ladder.`,
    other: {
      'twitter:label1': 'Level',
      'twitter:data1': `[${level}] ${levelData.name}`,
      'twitter:label2': 'Rating Date',
      'twitter:data2': date,
    },
  };
}

export default async function EncodedPage({ params }: Props) {
  const { level } = await params;
  if (!(level in LEVELS)) notFound();
  return <CareerThemes />;
}

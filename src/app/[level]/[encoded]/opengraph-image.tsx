import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { LEVELS } from '@/lib/levels';
import { buildArcs, OgLayout } from '@/lib/ogChart';
import { decodeRatings } from '@/lib/ratingsEncoding';
import type { LevelKeys } from '@/types/levels';

export const runtime = 'nodejs';
export const revalidate = 21600; // 6 hours
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ level: string; encoded: string }>;
}

export default async function OgImage({ params }: Props) {
  const { level, encoded } = await params;
  if (!(level in LEVELS)) notFound();
  if (Number.isNaN(parseInt(encoded, 36))) notFound();
  const ratings = decodeRatings(encoded, level as LevelKeys);
  const arcs = buildArcs(level as LevelKeys, ratings);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return new ImageResponse(
    <OgLayout
      levelName={LEVELS[level as LevelKeys].name}
      arcs={arcs}
      date={date}
    />,
    size,
  );
}

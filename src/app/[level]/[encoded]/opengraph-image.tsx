import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { LEVELS } from '@/lib/levels';
import { buildArcs, OG_SIZE, OgLayout } from '@/lib/ogChart';
import { decodeRatings } from '@/lib/ratingsEncoding';
import { formatRatingDate } from '@/lib/siteConfig';
import type { LevelKeys } from '@/types/levels';

export const runtime = 'nodejs';
export const revalidate = 21600; // 6 hours
export const size = OG_SIZE;
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
  const date = formatRatingDate();
  return new ImageResponse(
    <OgLayout
      levelName={LEVELS[level as LevelKeys].name}
      arcs={arcs}
      date={date}
    />,
    size,
  );
}

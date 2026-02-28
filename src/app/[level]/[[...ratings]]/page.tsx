import type { Metadata } from 'next';

import CareerThemes from '@/components/CareerThemes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; ratings?: string[] }>;
}): Promise<Metadata> {
  const { level, ratings = [] } = await params;
  const ogPath = ['/api/og', level, ...ratings].join('/');

  return {
    openGraph: {
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
  };
}

export default function LevelPage() {
  return <CareerThemes />;
}

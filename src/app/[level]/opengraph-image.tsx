import { ImageResponse } from 'next/og';
import { OG_SIZE, OgSimpleLayout } from '@/lib/ogChart';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(<OgSimpleLayout />, OG_SIZE);
}

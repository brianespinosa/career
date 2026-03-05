import type { MetadataRoute } from 'next';
import { SITE_TITLE } from '@/lib/siteConfig';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_TITLE,
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  };
}

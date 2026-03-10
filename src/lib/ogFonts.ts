import fs from 'node:fs';
import path from 'node:path';

async function fetchInter(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap',
    {
      headers: {
        // Older UA causes Google Fonts to serve TTF, which Satori supports.
        // Modern UAs return woff2, which Satori's fontkit parser does not support.
        'User-Agent':
          'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
      },
    },
  ).then((r) => r.text());

  const fontUrl =
    css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1] ??
    css.match(/src: url\((.+?)\) format\('opentype'\)/)?.[1] ??
    css.match(/src: url\((.+?)\) format\('woff'\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`Could not extract Inter font URL. CSS received:\n${css}`);
  }

  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export async function loadOgFonts(): Promise<
  {
    name: string;
    data: Buffer | ArrayBuffer;
    weight: 400 | 800;
    style: 'normal' | 'italic';
  }[]
> {
  const sinkinSansData = fs.readFileSync(
    path.join(process.cwd(), 'src/fonts/SinkinSans-800Black-webfont.woff'),
  );
  const interData = await fetchInter();

  return [
    { name: 'SinkinSans', data: sinkinSansData, weight: 800, style: 'normal' },
    { name: 'Inter', data: interData, weight: 400, style: 'normal' },
  ];
}

import fs from 'node:fs';
import path from 'node:path';

export function loadOgFonts(): {
  name: string;
  data: Buffer;
  weight: 400 | 800;
  style: 'normal' | 'italic';
}[] {
  const sinkinSansData = fs.readFileSync(
    path.join(process.cwd(), 'src/fonts/SinkinSans-800Black-webfont.woff'),
  );
  const interData = fs.readFileSync(
    path.join(process.cwd(), 'src/fonts/Inter-Regular.otf'),
  );

  return [
    { name: 'SinkinSans', data: sinkinSansData, weight: 800, style: 'normal' },
    { name: 'Inter', data: interData, weight: 400, style: 'normal' },
  ];
}

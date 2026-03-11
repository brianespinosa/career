import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadOgFonts } from './ogFonts';

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

describe('loadOgFonts', () => {
  beforeEach(() => {
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('fake'));
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/cwd');
  });

  it('returns exactly 2 entries', () => {
    expect(loadOgFonts()).toHaveLength(2);
  });

  it('entry 0 is SinkinSans weight 800 normal with Buffer data', () => {
    const [entry] = loadOgFonts();
    expect(entry).toMatchObject({
      name: 'SinkinSans',
      weight: 800,
      style: 'normal',
    });
    expect(Buffer.isBuffer(entry.data)).toBe(true);
  });

  it('entry 1 is Inter weight 400 normal with Buffer data', () => {
    const [, entry] = loadOgFonts();
    expect(entry).toMatchObject({
      name: 'Inter',
      weight: 400,
      style: 'normal',
    });
    expect(Buffer.isBuffer(entry.data)).toBe(true);
  });

  it('reads the SinkinSans font file', () => {
    loadOgFonts();
    const paths = vi
      .mocked(fs.readFileSync)
      .mock.calls.map((call) => String(call[0]));
    expect(
      paths.some((p) => p.includes('SinkinSans-800Black-webfont.woff')),
    ).toBe(true);
  });

  it('reads the Inter font file', () => {
    loadOgFonts();
    const paths = vi
      .mocked(fs.readFileSync)
      .mock.calls.map((call) => String(call[0]));
    expect(paths.some((p) => p.includes('Inter-Regular.otf'))).toBe(true);
  });

  it('both paths include the value from process.cwd()', () => {
    loadOgFonts();
    const paths = vi
      .mocked(fs.readFileSync)
      .mock.calls.map((call) => String(call[0]));
    expect(paths.every((p) => p.includes('/fake/cwd'))).toBe(true);
  });
});

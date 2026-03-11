import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SITE_TITLE } from '@/lib/siteConfig';
import type { LevelKeys } from '@/types/levels';
import { buildArcs, OgLayout, OgSimpleLayout } from './ogChart';

describe('buildArcs', () => {
  it('returns one arc per P1 attribute (16 total)', () => {
    const arcs = buildArcs('P1', {});
    expect(arcs).toHaveLength(16);
  });

  it('all arcs have empty pathD when ratings is {}', () => {
    const arcs = buildArcs('P1', {});
    expect(arcs.every((arc) => arc.pathD === '')).toBe(true);
  });

  it('arc for a rated attribute has non-empty pathD', () => {
    const arcs = buildArcs('P1', { acc: 3 });
    const accArc = arcs.find((arc) => arc.key === 'accountability');
    expect(accArc?.pathD).toBeTruthy();
  });

  it('same-theme arcs are contiguous — no theme reappears after a break', () => {
    const arcs = buildArcs('P1', {});
    const seenThemes = new Set<string>();
    let lastTheme = '';
    for (const arc of arcs) {
      if (arc.colorName !== lastTheme) {
        expect(seenThemes.has(arc.colorName)).toBe(false);
        seenThemes.add(arc.colorName);
        lastTheme = arc.colorName;
      }
    }
  });

  describe('unknown theme', () => {
    // This test uses vi.resetModules() + vi.doMock() to inject a synthetic bad-theme
    // attribute without affecting the statically-imported buildArcs used by other tests.
    // Sequencing: resetModules clears the cache → doMock registers the overrides →
    // dynamic import() picks them up → doUnmock + resetModules restores a clean state.
    // All other tests in this file use the already-resolved static import, so they
    // are unaffected by the module registry changes made here.
    it('logs console.error and uses fallback colorName', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      vi.resetModules();
      vi.doMock('@/data/attributes.json', () => ({
        default: {
          bad_attr: {
            key: 'bad_attr',
            param: 'bad',
            name: 'Bad Attr',
            theme: 'UNKNOWN_THEME',
          },
        },
      }));
      vi.doMock('@/data/ic.json', () => ({
        default: { P1: { name: 'P1 Name', attributes: { bad_attr: {} } } },
      }));
      vi.doMock('@/data/em.json', () => ({ default: {} }));

      const mod = await import('@/lib/ogChart');
      const arcs = mod.buildArcs('P1' as LevelKeys, {});

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(arcs[0].colorName).toBe('red');

      vi.doUnmock('@/data/attributes.json');
      vi.doUnmock('@/data/ic.json');
      vi.doUnmock('@/data/em.json');
      vi.resetModules();
    });
  });
});

describe('OgSimpleLayout', () => {
  it('renders an svg with aria-label "Ladder"', () => {
    render(<OgSimpleLayout />);
    expect(screen.getByRole('img', { name: 'Ladder' })).toBeInTheDocument();
  });

  it('renders SITE_TITLE text', () => {
    render(<OgSimpleLayout />);
    expect(screen.getByText(SITE_TITLE)).toBeInTheDocument();
  });
});

describe('OgLayout', () => {
  // Fixtures are initialized in beforeAll rather than at module level to keep
  // their evaluation clearly sequenced after the unknown-theme test's module
  // registry cleanup.
  let arcsWithRatings: ReturnType<typeof buildArcs>;
  let arcsEmpty: ReturnType<typeof buildArcs>;

  beforeAll(() => {
    arcsWithRatings = buildArcs('P1', { acc: 2 });
    arcsEmpty = buildArcs('P1', {});
  });

  it('renders svg with aria-label containing the levelName prop', () => {
    render(
      <OgLayout
        levelName='Senior Engineer'
        arcs={arcsWithRatings}
        date='March 10, 2026'
      />,
    );
    expect(
      screen.getByRole('img', { name: /Senior Engineer/i }),
    ).toBeInTheDocument();
  });

  it('renders levelName as text', () => {
    render(
      <OgLayout
        levelName='Senior Engineer'
        arcs={arcsWithRatings}
        date='March 10, 2026'
      />,
    );
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  });

  it('renders date as text', () => {
    render(
      <OgLayout
        levelName='Senior Engineer'
        arcs={arcsWithRatings}
        date='March 10, 2026'
      />,
    );
    expect(screen.getByText('March 10, 2026')).toBeInTheDocument();
  });

  it('renders at least one path when arcs have non-empty pathD', () => {
    const { container } = render(
      <OgLayout
        levelName='Senior Engineer'
        arcs={arcsWithRatings}
        date='March 10, 2026'
      />,
    );
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('renders zero path elements when all arcs have empty pathD', () => {
    const { container } = render(
      <OgLayout
        levelName='Senior Engineer'
        arcs={arcsEmpty}
        date='March 10, 2026'
      />,
    );
    expect(container.querySelectorAll('path')).toHaveLength(0);
  });
});

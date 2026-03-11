import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from '@/hooks/RatingsProvider';
import type { AttributeValues } from '@/types/attributes';
import OpportunitiesCard, { toOpacity } from './OpportunitiesCard';

// motion/react is mocked because OpportunitiesCard uses AnimatePresence and motion.li/motion.aside.
// The mock keeps children rendering without animation so DOM assertions work synchronously.
// Opacity animation behavior (that motion.li correctly applies animate.opacity in a real browser)
// is covered by e2e tests — see GitHub issue #77.
vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    li: ({
      children,
      animate: _animate,
      initial: _initial,
      exit: _exit,
      transition: _transition,
      layout: _layout,
      ...props
    }: {
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      exit?: unknown;
      transition?: unknown;
      layout?: unknown;
    } & React.HTMLAttributes<HTMLLIElement>) => <li {...props}>{children}</li>,
    aside: ({
      children,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      ...props
    }: {
      children?: React.ReactNode;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
    } & React.HTMLAttributes<HTMLElement>) => (
      <aside {...props}>{children}</aside>
    ),
  },
}));

type AttributeOption = Omit<AttributeValues, 'value'>;

const attributeValues: AttributeOption[] = [
  {
    key: 'attr1',
    name: 'Attr One',
    param: 'a1',
    theme: 'WHAT',
    color: 'red',
    description: 'Desc one',
  },
  {
    key: 'attr2',
    name: 'Attr Two',
    param: 'a2',
    theme: 'WHO',
    color: 'blue',
    description: 'Desc two',
  },
  {
    key: 'attr3',
    name: 'Attr Three',
    param: 'a3',
    theme: 'WHY',
    color: 'green',
    description: 'Desc three',
  },
];

const defaultProps = {
  attributeValues,
  levelKey: 'P1',
  levelName: 'Software Engineer I',
};

const renderOpportunitiesCard = (ratings: Record<string, number> = {}) =>
  render(
    <Theme>
      <RatingsContext.Provider
        value={{ ratings, setRating: vi.fn(), clearRatings: vi.fn() }}
      >
        <OpportunitiesCard {...defaultProps} />
      </RatingsContext.Provider>
    </Theme>,
  );

describe('toOpacity', () => {
  it('returns 1 when min equals max (uniform ratings)', () => {
    expect(toOpacity(2, 2, 2)).toBe(1);
  });

  it('returns 1 for the lowest-rated item (min of a spread)', () => {
    expect(toOpacity(1, 1, 3)).toBe(1);
  });

  it('returns 0.25 for the highest-rated item (max of a spread)', () => {
    expect(toOpacity(3, 1, 3)).toBe(0.25);
  });

  it('returns an intermediate value for mid-range ratings', () => {
    expect(toOpacity(2, 1, 3)).toBeCloseTo(0.625);
  });
});

describe('OpportunitiesCard', () => {
  describe('visibility', () => {
    it('renders nothing when ratings is {}', () => {
      renderOpportunitiesCard({});
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders the Opportunities tab when at least one attribute is rated', () => {
      renderOpportunitiesCard({ a1: 2 });
      expect(
        screen.getByRole('tab', { name: /Opportunities/ }),
      ).toBeInTheDocument();
    });

    it('shows a single rated attribute without filtering it out', () => {
      renderOpportunitiesCard({ a1: 2 });
      expect(screen.getByText('Attr One')).toBeInTheDocument();
    });
  });

  describe('filtering (visible computation)', () => {
    it('shows all rated attributes when all share the same rating', () => {
      renderOpportunitiesCard({ a1: 2, a2: 2, a3: 2 });
      expect(screen.getByText('Attr One')).toBeInTheDocument();
      expect(screen.getByText('Attr Two')).toBeInTheDocument();
      expect(screen.getByText('Attr Three')).toBeInTheDocument();
    });

    it('excludes the highest-rated attribute when multiple distinct rating values exist', () => {
      renderOpportunitiesCard({ a1: 1, a2: 3 });
      expect(screen.getByText('Attr One')).toBeInTheDocument();
      expect(screen.queryByText('Attr Two')).not.toBeInTheDocument();
    });

    it('shows only non-highest attributes when three distinct rating levels exist', () => {
      renderOpportunitiesCard({ a1: 1, a2: 2, a3: 3 });
      expect(screen.getByText('Attr One')).toBeInTheDocument();
      expect(screen.getByText('Attr Two')).toBeInTheDocument();
      expect(screen.queryByText('Attr Three')).not.toBeInTheDocument();
    });
  });

  describe('sort order', () => {
    it('lower-rated attributes appear before higher-rated attributes', () => {
      // a1=3, a2=1, a3=2 — sorted order should be a2(1), a3(2); a1(3) excluded as highest
      renderOpportunitiesCard({ a1: 3, a2: 1, a3: 2 });
      const items = screen.getAllByRole('listitem');
      const names = items.map((li) => li.textContent ?? '');
      const a2Index = names.findIndex((t) => t.includes('Attr Two'));
      const a3Index = names.findIndex((t) => t.includes('Attr Three'));
      expect(a2Index).toBeLessThan(a3Index);
    });
  });

  describe('rating labels', () => {
    it('shows the rating label next to each visible attribute name', () => {
      // a1 rated 1 (Never) is visible; a2 rated 3 (Sometimes) is the highest and excluded
      renderOpportunitiesCard({ a1: 1, a2: 3 });
      expect(screen.getByText(/\(Never\)/)).toBeInTheDocument();
    });
  });

  describe('tabs', () => {
    it('renders both Opportunities and Goal Prompt tabs', () => {
      renderOpportunitiesCard({ a1: 2 });
      expect(
        screen.getByRole('tab', { name: /Opportunities/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: /Goal Prompt/ }),
      ).toBeInTheDocument();
    });
  });
});

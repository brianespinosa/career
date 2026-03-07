import { act, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';
import RatingsProvider, { RatingsContext } from './RatingsProvider';

const Consumer = () => {
  const { ratings, setRating, clearRatings } = useContext(RatingsContext);
  return (
    <div>
      <span data-testid='ratings'>{JSON.stringify(ratings)}</span>
      <button type='button' onClick={() => setRating('foo', 3)}>
        set
      </button>
      <button type='button' onClick={clearRatings}>
        clear
      </button>
    </div>
  );
};

const renderWithPathname = (pathname: string) => {
  vi.mocked(usePathname).mockReturnValue(pathname);
  return render(
    <RatingsProvider>
      <Consumer />
    </RatingsProvider>,
  );
};

const parseRatings = (el: HTMLElement) =>
  JSON.parse(el.textContent ?? '{}') as Record<string, number>;

describe('RatingsProvider', () => {
  it('initializes with empty ratings for a path with no encoded segment', () => {
    renderWithPathname('/P1');
    expect(parseRatings(screen.getByTestId('ratings'))).toEqual({});
  });

  it('initializes ratings from a valid encoded path', () => {
    // /P1/3ckmgrhn is the stable known-good URL used in e2e and Lighthouse CI
    renderWithPathname('/P1/3ckmgrhn');
    const ratings = parseRatings(screen.getByTestId('ratings'));
    for (const v of Object.values(ratings)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(4);
    }
  });

  it('setRating updates the ratings in context and syncs the URL', () => {
    const replaceState = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { pathname: '/P1' },
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: { replaceState, state: null },
      writable: true,
    });

    renderWithPathname('/P1');
    act(() => {
      screen.getByRole('button', { name: 'set' }).click();
    });
    const ratings = parseRatings(screen.getByTestId('ratings'));
    expect(ratings.foo).toBe(3);
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringMatching(/^\/P1\/[a-z0-9]+$/),
    );
  });

  it('setRating still updates state when replaceState throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(window, 'location', {
      value: { pathname: '/P1' },
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn().mockImplementation(() => {
          throw new Error('SecurityError');
        }),
        state: null,
      },
      writable: true,
    });

    renderWithPathname('/P1');
    act(() => {
      screen.getByRole('button', { name: 'set' }).click();
    });
    expect(parseRatings(screen.getByTestId('ratings')).foo).toBe(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[RatingsProvider] replaceState failed'),
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('clearRatings resets ratings to empty and syncs the URL', () => {
    const replaceState = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { pathname: '/P1' },
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: { replaceState, state: null },
      writable: true,
    });

    renderWithPathname('/P1');
    act(() => {
      screen.getByRole('button', { name: 'set' }).click();
    });
    act(() => {
      screen.getByRole('button', { name: 'clear' }).click();
    });
    expect(parseRatings(screen.getByTestId('ratings'))).toEqual({});
    expect(replaceState).toHaveBeenLastCalledWith(null, '', '/P1');
  });
});

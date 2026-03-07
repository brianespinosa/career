import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from './RatingsProvider';
import useRatingParam, { RATINGS } from './useRatingParam';

const makeWrapper =
  (
    ratings: Record<string, number> = {},
    setRating: (param: string, value: number) => void = () => {},
  ) =>
  ({ children }: { children: React.ReactNode }) => (
    <RatingsContext.Provider
      value={{ ratings, setRating, clearRatings: () => {} }}
    >
      {children}
    </RatingsContext.Provider>
  );

describe('useRatingParam', () => {
  it('returns null when attribute has no rating', () => {
    const { result } = renderHook(() => useRatingParam('someParam'), {
      wrapper: makeWrapper(),
    });
    const [rating] = result.current;
    expect(rating).toBeNull();
  });

  it('returns the correct RatingKey when attribute has a rating', () => {
    const { result } = renderHook(() => useRatingParam('someParam'), {
      wrapper: makeWrapper({ someParam: 3 }),
    });
    const [rating] = result.current;
    expect(rating).toBe('3');
  });

  it('calls setRating with numeric value on the context', () => {
    const setRating = vi.fn();
    const { result } = renderHook(() => useRatingParam('someParam'), {
      wrapper: makeWrapper({}, setRating),
    });
    const [, setValue] = result.current;
    act(() => {
      setValue('2');
    });
    expect(setRating).toHaveBeenCalledWith('someParam', 2);
  });

  it('returns the RATINGS dictionary as the third element', () => {
    const { result } = renderHook(() => useRatingParam('someParam'), {
      wrapper: makeWrapper(),
    });
    const [, , ratings] = result.current;
    expect(ratings).toEqual(RATINGS);
  });
});

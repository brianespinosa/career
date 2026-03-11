import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from '@/hooks/RatingsProvider';
import RatingSelect from './RatingSelect';

const renderRatingSelect = (ratings: Record<string, number> = {}) =>
  render(
    <Theme>
      <RatingsContext.Provider
        value={{ ratings, setRating: vi.fn(), clearRatings: vi.fn() }}
      >
        <RatingSelect attributeParam='acc' attributeId='accountability' />
      </RatingsContext.Provider>
    </Theme>,
  );

describe('RatingSelect', () => {
  it('renders "Pick one" placeholder when attribute is not rated', () => {
    renderRatingSelect();
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders the rating label when ratings[param] = 3', () => {
    renderRatingSelect({ acc: 3 });
    expect(screen.getByText('Sometimes')).toBeInTheDocument();
  });

  it('trigger has surface variant class when not rated', () => {
    renderRatingSelect();
    expect(screen.getByRole('combobox')).toHaveClass('rt-variant-surface');
  });

  it('trigger has soft variant class when rated', () => {
    renderRatingSelect({ acc: 2 });
    expect(screen.getByRole('combobox')).toHaveClass('rt-variant-soft');
  });

  it('all four rating options are present when dropdown is opened', async () => {
    const user = userEvent.setup();
    renderRatingSelect();
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Never' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rarely' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Sometimes' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Always' })).toBeInTheDocument();
  });
});

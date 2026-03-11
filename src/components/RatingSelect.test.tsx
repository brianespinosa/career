import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from '@/hooks/RatingsProvider';
import RatingSelect from './RatingSelect';

const mockSetRating = vi.fn();

const renderRatingSelect = (ratings: Record<string, number> = {}) =>
  render(
    <Theme>
      <RatingsContext.Provider
        value={{ ratings, setRating: mockSetRating, clearRatings: vi.fn() }}
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

  it('trigger has surface variant class when not rated, not soft', () => {
    // rt-variant-* classes are how @radix-ui/themes expresses the variant prop on the DOM element
    renderRatingSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('rt-variant-surface');
    expect(trigger).not.toHaveClass('rt-variant-soft');
  });

  it('trigger has soft variant class when rated, not surface', () => {
    renderRatingSelect({ acc: 2 });
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('rt-variant-soft');
    expect(trigger).not.toHaveClass('rt-variant-surface');
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

  it('calls setRating with the numeric value when an option is selected', async () => {
    const user = userEvent.setup();
    renderRatingSelect();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Never' }));
    expect(mockSetRating).toHaveBeenCalledWith('acc', 1);
  });
});

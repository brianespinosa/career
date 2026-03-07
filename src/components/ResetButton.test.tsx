import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from '@/hooks/RatingsProvider';
import ResetButton from './ResetButton';

const renderResetButton = (
  ratings: Record<string, number> = {},
  clearRatings = vi.fn(),
) =>
  render(
    <Theme>
      <RatingsContext.Provider
        value={{ ratings, setRating: vi.fn(), clearRatings }}
      >
        <ResetButton />
      </RatingsContext.Provider>
    </Theme>,
  );

describe('ResetButton', () => {
  it('renders the reset icon button', () => {
    renderResetButton();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('is disabled when there are no ratings', () => {
    renderResetButton({});
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('is enabled when ratings exist', () => {
    renderResetButton({ foo: 2 });
    expect(screen.getByRole('button', { name: 'Reset' })).not.toBeDisabled();
  });
});

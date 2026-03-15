import { Theme } from '@radix-ui/themes';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('calls clearRatings when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const clearRatings = vi.fn();
    renderResetButton({ foo: 2 }, clearRatings);

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Reset' }));

    expect(clearRatings).toHaveBeenCalledOnce();
  });
});

import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RatingsContext } from '@/hooks/RatingsProvider';
import { toAttributeId } from '@/lib/attributeId';
import CareerAttribute from './CareerAttribute';

const renderCareerAttribute = (ratings: Record<string, number> = {}) =>
  render(
    <Theme>
      <RatingsContext.Provider
        value={{ ratings, setRating: vi.fn(), clearRatings: vi.fn() }}
      >
        <CareerAttribute
          attribute='accountability'
          description='Test description text'
        />
      </RatingsContext.Provider>
    </Theme>,
  );

describe('CareerAttribute', () => {
  it('renders attribute name as an h4 heading', () => {
    renderCareerAttribute();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Accountability' }),
    ).toBeInTheDocument();
  });

  it('heading id equals toAttributeId("Accountability")', () => {
    renderCareerAttribute();
    const heading = screen.getByRole('heading', {
      level: 4,
      name: 'Accountability',
    });
    expect(heading).toHaveAttribute('id', toAttributeId('Accountability'));
  });

  it('renders the description text prop', () => {
    renderCareerAttribute();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('renders a select element (from RatingSelect)', () => {
    renderCareerAttribute();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

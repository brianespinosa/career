import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PropertyList from './PropertyList';

const renderPropertyList = (props: React.ComponentProps<typeof PropertyList>) =>
  render(
    <Theme>
      <PropertyList {...props} />
    </Theme>,
  );

describe('PropertyList', () => {
  it('renders each label and value', () => {
    renderPropertyList({
      properties: { 'Radford Level': 'P1', 'Typical Experience': '0–2 years' },
    });
    expect(screen.getByText('Radford Level')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('Typical Experience')).toBeInTheDocument();
    expect(screen.getByText('0–2 years')).toBeInTheDocument();
  });

  it('renders nothing when properties is empty', () => {
    const { container } = renderPropertyList({ properties: {} });
    expect(container.querySelectorAll('dt, dd').length).toBe(0);
  });
});

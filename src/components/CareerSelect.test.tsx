'use client';

import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: () => ({ push: mockPush }),
}));

import { useParams } from 'next/navigation';
import CareerSelect from './CareerSelect';

const renderCareerSelect = () =>
  render(
    <Theme>
      <CareerSelect />
    </Theme>,
  );

describe('CareerSelect', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({});
  });

  it('renders a trigger with aria-label "Career level"', () => {
    renderCareerSelect();
    expect(
      screen.getByRole('combobox', { name: 'Career level' }),
    ).toBeInTheDocument();
  });

  it('shows placeholder "Select level..." when no level in params', () => {
    renderCareerSelect();
    expect(screen.getByText('Select level...')).toBeInTheDocument();
  });

  it('shows the current level label when useParams returns { level: "P1" }', () => {
    vi.mocked(useParams).mockReturnValue({ level: 'P1' });
    renderCareerSelect();
    expect(
      screen.getByRole('combobox', { name: 'Career level' }),
    ).toHaveTextContent('[P1] Software Engineer I');
  });

  it('renders IC and EM group labels when dropdown is opened', async () => {
    const user = userEvent.setup();
    renderCareerSelect();
    await user.click(screen.getByRole('combobox', { name: 'Career level' }));
    expect(screen.getByText('IC')).toBeInTheDocument();
    expect(screen.getByText('EM')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders an SVG with an accessible title', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTitle('Loading')).toBeInTheDocument();
  });

  it('has role="img" on the SVG', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

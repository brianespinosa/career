import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageLayout from './PageLayout';

const renderPageLayout = (props: React.ComponentProps<typeof PageLayout>) =>
  render(
    <Theme>
      <PageLayout {...props} />
    </Theme>,
  );

describe('PageLayout', () => {
  it('renders the right slot', () => {
    renderPageLayout({ right: <div>right content</div> });
    expect(screen.getByText('right content')).toBeInTheDocument();
  });

  it('renders the left slot when provided', () => {
    renderPageLayout({
      left: <div>left content</div>,
      right: <div>right</div>,
    });
    expect(screen.getByText('left content')).toBeInTheDocument();
  });

  it('applies leftId to the left column wrapper', () => {
    const { container } = renderPageLayout({
      right: <div>right</div>,
      leftId: 'main-content',
    });
    expect(container.querySelector('#main-content')).toBeInTheDocument();
  });
});

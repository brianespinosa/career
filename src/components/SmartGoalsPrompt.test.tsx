import { Theme } from '@radix-ui/themes';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SmartGoalsPrompt from './SmartGoalsPrompt';

const defaultProps = {
  levelKey: 'P1',
  levelName: 'Software Engineer I',
  themeGroups: [
    {
      theme: 'Technical Skills',
      attributes: [{ name: 'Code Quality', description: 'Writes clean code' }],
    },
  ],
};

const renderPrompt = (props = defaultProps) =>
  render(
    <Theme>
      <SmartGoalsPrompt {...props} />
    </Theme>,
  );

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  });
});

describe('SmartGoalsPrompt', () => {
  it('renders a read-only textarea', () => {
    renderPrompt();
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('includes the level key and name in the generated prompt', () => {
    renderPrompt();
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('P1');
    expect(textarea.value).toContain('Software Engineer I');
  });

  it('includes IC track label for P-prefix levels', () => {
    renderPrompt();
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Software Engineer (IC)');
  });

  it('includes EM track label for M-prefix levels', () => {
    renderPrompt({
      ...defaultProps,
      levelKey: 'M3',
      levelName: 'Engineering Manager III',
    });
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Engineering Manager (EM)');
  });

  it('renders the copy button with idle label', () => {
    renderPrompt();
    expect(
      screen.getByRole('button', { name: /copy prompt/i }),
    ).toBeInTheDocument();
  });

  it('shows "Copied!" label on the copy button after a successful copy', async () => {
    const user = userEvent.setup();
    renderPrompt();
    await user.click(screen.getByRole('button', { name: /copy prompt/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /copied/i }),
      ).toBeInTheDocument();
    });
  });
});

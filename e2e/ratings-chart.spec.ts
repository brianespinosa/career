import { expect, test } from '@playwright/test';
import { P1_ENCODED } from './fixtures/ratings';

test.describe('RatingsChart', () => {
  test.describe('arc click scrolls to attribute heading', () => {
    // Direction is rated Never(1) in P1_ENCODED and uses the HOW theme (amber color).
    // Its arc path is identifiable by fill="var(--amber-6)".
    // Clicking the arc calls scrollToAttribute('Direction'), which scrolls the
    // Direction heading into view.
    test('clicking a rated arc scrolls the matching attribute heading into view', async ({
      page,
    }) => {
      await page.goto(`/P1/${P1_ENCODED}`);

      // Wait for the chart to mount (next/dynamic with ssr: false).
      const arc = page.locator('path[fill="var(--amber-6)"]');
      await expect(arc).toBeVisible();

      await arc.click();

      await expect(
        page.getByRole('heading', { name: 'Direction' }),
      ).toBeInViewport();
    });
  });

  test.describe('EM career level', () => {
    // M3 is the first Engineering Manager level (Manager).
    test('level heading is visible on the M3 page', async ({ page }) => {
      await page.goto('/M3');
      await expect(
        page.getByRole('heading', { name: 'Manager' }),
      ).toBeVisible();
    });

    test('at least one attribute combobox is visible on the M3 page', async ({
      page,
    }) => {
      await page.goto('/M3');
      await expect(page.getByRole('combobox').first()).toBeVisible();
    });
  });
});

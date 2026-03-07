import { expect, test } from '@playwright/test';
import { P1_ENCODED, P1_OPPORTUNITIES } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('OpportunitiesCard', () => {
  test('is not present on a bare level page with no ratings', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await page.goto('/P1');

    // Confirm the page has loaded before asserting the card's absence.
    await expect(
      page.getByRole('combobox', { name: 'Accountability' }),
    ).toBeVisible();

    await expect(app.opportunitiesTab).not.toBeVisible();
  });

  test('appears and lists low-rated attributes on an encoded URL', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await page.goto(`/P1/${P1_ENCODED}`);

    await expect(app.opportunitiesTab).toBeVisible();

    expect(P1_OPPORTUNITIES.length).toBeGreaterThan(0);
    for (const { name, ratingLabel } of P1_OPPORTUNITIES) {
      const link = page.getByRole('link', { name: new RegExp(name) });
      await expect(link).toBeVisible();
      await expect(link).toContainText(`(${ratingLabel})`);
    }
  });
});

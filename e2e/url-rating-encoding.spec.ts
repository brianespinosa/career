import { expect, test } from '@playwright/test';
import { P1_ENCODED, P1_ENCODED_RATINGS } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('url-based rating encoding', () => {
  test('pre-encoded URL restores correct rating state in attribute dropdowns', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await page.goto(`/P1/${P1_ENCODED}`);

    // OpportunitiesCard only appears after client hydration — use it as a
    // hydration signal before asserting on rating values.
    await expect(app.opportunitiesTab).toBeVisible();

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.acc.name }),
    ).toContainText(P1_ENCODED_RATINGS.acc.label);

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.dir.name }),
    ).toContainText(P1_ENCODED_RATINGS.dir.label);
  });
});

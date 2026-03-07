import { expect, test } from '@playwright/test';
import { P1_ENCODED, P1_ENCODED_RATINGS } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('url-based rating encoding', () => {
  test('pre-encoded URL restores correct rating state in attribute dropdowns', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await page.goto(`/P1/${P1_ENCODED}`);

    // OpportunitiesCard only mounts after the dynamic import resolves AND
    // rated.length > 0 — waiting for it confirms both client hydration and
    // correct URL decoding before asserting on individual rating values.
    await expect(app.opportunitiesTab).toBeVisible();

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.acc.name }),
    ).toContainText(P1_ENCODED_RATINGS.acc.label);

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.ctd.name }),
    ).toContainText(P1_ENCODED_RATINGS.ctd.label);

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.dir.name }),
    ).toContainText(P1_ENCODED_RATINGS.dir.label);

    await expect(
      page.getByRole('combobox', { name: P1_ENCODED_RATINGS.inf.name }),
    ).toContainText(P1_ENCODED_RATINGS.inf.label);
  });

  test('selecting a rating updates the URL with an encoded segment', async ({
    page,
  }) => {
    await page.goto('/P1');

    await page.getByRole('combobox', { name: 'Accountability' }).click();
    await page.getByRole('option', { name: 'Sometimes' }).click();

    await expect(page).toHaveURL(/\/P1\/.+/);
  });
});

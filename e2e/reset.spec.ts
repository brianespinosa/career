import { expect, test } from '@playwright/test';
import { P1_ENCODED } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('reset interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/P1/${P1_ENCODED}`);
  });

  test('cancel leaves ratings and URL unchanged', async ({ page }) => {
    const app = new AppPage(page);
    await expect(app.opportunitiesTab).toBeVisible();

    await app.resetButton.click();
    await expect(page.getByRole('alertdialog')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('alertdialog')).not.toBeVisible();
    await expect(page).toHaveURL(`/P1/${P1_ENCODED}`);
  });

  test('confirming reset clears ratings and navigates to the level URL', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await expect(app.opportunitiesTab).toBeVisible();

    await app.resetButton.click();

    // Scope to the dialog to disambiguate from the header IconButton.
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Reset' })
      .click();

    await expect(page).toHaveURL(/\/P1$/);
    await expect(app.resetButton).toBeDisabled();
    await expect(app.opportunitiesTab).not.toBeVisible();
  });
});

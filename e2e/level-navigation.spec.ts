import { expect, test } from '@playwright/test';
import { AppPage } from './pages/AppPage';

test.describe('level navigation', () => {
  test('selecting a level navigates to the correct URL and renders the level heading', async ({
    page,
  }) => {
    const app = new AppPage(page);
    await page.goto('/P1');

    await app.careerSelect.click();
    await page
      .getByRole('option', { name: '[P2] Software Engineer II' })
      .click();

    await expect(page).toHaveURL(/\/P2$/);
    await expect(
      page.getByRole('heading', { name: 'Software Engineer II' }),
    ).toBeVisible();
  });
});

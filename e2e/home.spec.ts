import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the About the App card heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'About the App' }),
    ).toBeVisible();
  });

  test('renders the Saving Assessments card heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Saving Assessments' }),
    ).toBeVisible();
  });

  test('renders the Get Started callout heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Get Started' }),
    ).toBeVisible();
  });

  test('passes axe accessibility scan', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

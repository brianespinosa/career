import AxeBuilder from '@axe-core/playwright';
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

  test.describe('sort order', () => {
    // Rate Direction=Sometimes(3) to establish max so lower-rated items appear.
    // Rate Coding, Testing, & Debugging=Rarely(2) → visible (2 < 3).
    // Then rate Accountability=Never(1) → it should appear first (1 < 2).
    test('lower-rated attribute appears before higher-rated attribute', async ({
      page,
    }) => {
      const app = new AppPage(page);
      await page.goto('/P1');

      await page.getByRole('combobox', { name: 'Direction' }).selectOption('3');
      await page
        .getByRole('combobox', { name: 'Coding, Testing, & Debugging' })
        .selectOption('2');

      await expect(app.opportunitiesTab).toBeVisible();

      await page
        .getByRole('combobox', { name: 'Accountability' })
        .selectOption('1');

      const items = page.getByRole('listitem');
      await expect(items.first()).toContainText('Accountability');
      await expect(items.nth(1)).toContainText('Coding, Testing, & Debugging');
    });

    test('sort order updates when a new rating changes the minimum', async ({
      page,
    }) => {
      const app = new AppPage(page);
      await page.goto('/P1');

      await page.getByRole('combobox', { name: 'Direction' }).selectOption('3');
      await page
        .getByRole('combobox', { name: 'Coding, Testing, & Debugging' })
        .selectOption('2');

      await expect(app.opportunitiesTab).toBeVisible();
      await expect(page.getByRole('listitem').first()).toContainText(
        'Coding, Testing, & Debugging',
      );

      await page
        .getByRole('combobox', { name: 'Accountability' })
        .selectOption('1');

      await expect(page.getByRole('listitem').first()).toContainText(
        'Accountability',
      );
    });
  });

  test.describe('animated opacity', () => {
    // With Never(1) and Rarely(2) visible (Sometimes(3) excluded as max):
    //   minRating=1, maxRating=2 among visible items.
    //   toOpacity(1, 1, 2) = 1 - 0 = 1.0
    //   toOpacity(2, 1, 2) = 1 - 0.75 = 0.25
    test.beforeEach(async ({ page }) => {
      await page.goto('/P1');
      await page.getByRole('combobox', { name: 'Direction' }).selectOption('3');
      await page
        .getByRole('combobox', { name: 'Accountability' })
        .selectOption('1');
      await page
        .getByRole('combobox', { name: 'Coding, Testing, & Debugging' })
        .selectOption('2');
      await expect(
        page.getByRole('tab', { name: 'Opportunities' }),
      ).toBeVisible();
    });

    test('Never-rated item has opacity 1', async ({ page }) => {
      const item = page
        .getByRole('listitem')
        .filter({ has: page.getByText('Accountability') });
      await expect(item).toHaveCSS('opacity', '1');
    });

    test('Rarely-rated item has opacity less than 1', async ({ page }) => {
      const item = page
        .getByRole('listitem')
        .filter({ has: page.getByText('Coding, Testing, & Debugging') });
      await expect
        .poll(async () =>
          item.evaluate((el) => parseFloat(getComputedStyle(el).opacity)),
        )
        .toBeLessThan(1);
    });
  });

  test('passes axe accessibility scan on a rated page', async ({ page }) => {
    await page.goto(`/P1/${P1_ENCODED}`);
    // Wait for dynamic components to mount before running axe.
    await expect(
      page.getByRole('tab', { name: 'Opportunities' }),
    ).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

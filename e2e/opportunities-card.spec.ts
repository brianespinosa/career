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
    // Rate Direction=Sometimes to establish max so lower-rated items appear.
    // Rate Coding, Testing, & Debugging=Rarely → visible (Rarely < Sometimes).
    // Then rate Accountability=Never in each test → it should appear first.
    test.beforeEach(async ({ page }) => {
      await page.goto('/P1');
      await page.getByRole('combobox', { name: 'Direction' }).click();
      await page.getByRole('option', { name: 'Sometimes' }).click();
      await page
        .getByRole('combobox', { name: 'Coding, Testing, & Debugging' })
        .click();
      await page.getByRole('option', { name: 'Rarely' }).click();
      await expect(
        page.getByRole('tab', { name: 'Opportunities' }),
      ).toBeVisible();
    });

    test('lower-rated attribute appears before higher-rated attribute', async ({
      page,
    }) => {
      await page.getByRole('combobox', { name: 'Accountability' }).click();
      await page.getByRole('option', { name: 'Never' }).click();

      const items = page.getByRole('tabpanel').getByRole('listitem');
      await expect(items.first()).toContainText('Accountability');
      await expect(items.nth(1)).toContainText('Coding, Testing, & Debugging');
    });

    test('sort order updates when a new rating changes the minimum', async ({
      page,
    }) => {
      await expect(
        page.getByRole('tabpanel').getByRole('listitem').first(),
      ).toContainText('Coding, Testing, & Debugging');

      await page.getByRole('combobox', { name: 'Accountability' }).click();
      await page.getByRole('option', { name: 'Never' }).click();

      await expect(
        page.getByRole('tabpanel').getByRole('listitem').first(),
      ).toContainText('Accountability');
    });
  });

  test.describe('animated opacity', () => {
    // With Never and Rarely visible (Sometimes excluded as max):
    //   minRating=1, maxRating=2 among visible items.
    //   toOpacity(1, 1, 2) = 1 - ((1-1)/(2-1)) * 0.75 = 1.0
    //   toOpacity(2, 1, 2) = 1 - ((2-1)/(2-1)) * 0.75 = 0.25
    // The Rarely-rated item test asserts > 0 and < 1 rather than the exact value
    // because Framer Motion animates opacity asynchronously; pinning to 0.25
    // could race against the in-flight animation settling.
    test.beforeEach(async ({ page }) => {
      await page.goto('/P1');
      await page.getByRole('combobox', { name: 'Direction' }).click();
      await page.getByRole('option', { name: 'Sometimes' }).click();
      await page.getByRole('combobox', { name: 'Accountability' }).click();
      await page.getByRole('option', { name: 'Never' }).click();
      await page
        .getByRole('combobox', { name: 'Coding, Testing, & Debugging' })
        .click();
      await page.getByRole('option', { name: 'Rarely' }).click();
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

    test('Rarely-rated item has opacity between 0 and 1', async ({ page }) => {
      const item = page
        .getByRole('listitem')
        .filter({ has: page.getByText('Coding, Testing, & Debugging') });
      const getOpacity = () =>
        item.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
      await expect.poll(getOpacity).toBeGreaterThan(0);
      await expect.poll(getOpacity).toBeLessThan(1);
    });
  });

  test('passes axe accessibility scan on a rated page', async ({ page }) => {
    await page.goto(`/P1/${P1_ENCODED}`);
    // Wait for dynamic components to mount before running axe.
    await expect(
      page.getByRole('tab', { name: 'Opportunities' }),
    ).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.html),
      })),
    ).toEqual([]);
  });
});

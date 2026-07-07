import AxeBuilder from '@axe-core/playwright';
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

  const customerSupportLevels = [
    { url: '/P1PS', heading: 'Product Support Specialist' },
    { url: '/P1TSE', heading: 'Technical Support Engineer' },
    { url: '/M2CS', heading: 'Customer Operations Manager I / TSE Manager I' },
  ];

  for (const { url, heading } of customerSupportLevels) {
    test(`renders the Customer Support level ${url} with Impact/Collaboration/Growth themes`, async ({
      page,
    }) => {
      await page.goto(url);

      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Impact', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Collaboration', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Growth', exact: true }),
      ).toBeVisible();
    });
  }

  test('Customer Support level passes axe accessibility scan', async ({
    page,
  }) => {
    await page.goto('/P1PS');
    await expect(
      page.getByRole('heading', { name: 'Product Support Specialist' }),
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

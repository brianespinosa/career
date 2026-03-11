import { expect, test } from '@playwright/test';
import { P1_ENCODED } from './fixtures/ratings';

test.describe('OG image routes', () => {
  test('GET /P1/opengraph-image returns an image', async ({ page }) => {
    const response = await page.request.get('/P1/opengraph-image');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/');
  });

  test('GET /P1/<encoded>/opengraph-image returns an image', async ({
    page,
  }) => {
    const response = await page.request.get(
      `/P1/${P1_ENCODED}/opengraph-image`,
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/');
  });
});

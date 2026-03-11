import { expect, test } from '@playwright/test';
import { P1_ENCODED } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('SmartGoalsPrompt', () => {
  test.beforeEach(async ({ page }) => {
    const app = new AppPage(page);
    await page.goto(`/P1/${P1_ENCODED}`);
    await expect(app.opportunitiesTab).toBeVisible();
    await app.goalPromptTab.click();
  });

  test('clicking Goal Prompt tab makes the panel visible', async ({ page }) => {
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('textarea contains the level name', async ({ page }) => {
    await expect(page.getByRole('textbox')).toContainText(
      'Software Engineer I',
    );
  });

  test('clicking copy writes textarea content to clipboard', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const app = new AppPage(page);
    const promptText = await page.getByRole('textbox').inputValue();

    await app.copyPromptButton.click();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(promptText);
  });
});

import { expect, test } from '@playwright/test';
import { P1_ENCODED } from './fixtures/ratings';
import { AppPage } from './pages/AppPage';

test.describe('SmartGoalsPrompt', () => {
  test.beforeEach(async ({ page }) => {
    const app = new AppPage(page);
    await page.goto(`/P1/${P1_ENCODED}`);
    await expect(app.opportunitiesTab).toBeVisible();
    await app.goalPromptTab.click();
    // Wait for the Goal Prompt panel to open before each test runs.
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('clicking Goal Prompt tab makes the panel visible', async ({ page }) => {
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('textarea contains the level name', async ({ page }) => {
    await expect(page.getByRole('textbox')).toHaveValue(/Software Engineer I/);
  });

  test('clicking copy writes textarea content to clipboard', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const app = new AppPage(page);
    const promptText = await page.getByRole('textbox').inputValue();
    expect(promptText).toBeTruthy();

    await app.copyPromptButton.click();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(promptText);
  });
});

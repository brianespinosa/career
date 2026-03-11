import type { Locator, Page } from '@playwright/test';

export class AppPage {
  readonly page: Page;
  readonly careerSelect: Locator;
  readonly resetButton: Locator;
  readonly opportunitiesTab: Locator;
  readonly goalPromptTab: Locator;
  readonly copyPromptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.careerSelect = page.getByRole('combobox', { name: 'Career level' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.opportunitiesTab = page.getByRole('tab', { name: 'Opportunities' });
    this.goalPromptTab = page.getByRole('tab', { name: 'Goal Prompt' });
    this.copyPromptButton = page.getByRole('button', { name: /copy/i });
  }
}

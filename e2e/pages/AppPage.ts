import type { Locator, Page } from '@playwright/test';

export class AppPage {
  readonly page: Page;
  readonly careerSelect: Locator;
  readonly resetButton: Locator;
  readonly opportunitiesTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.careerSelect = page.getByRole('combobox', { name: 'Career level' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.opportunitiesTab = page.getByRole('tab', { name: 'Opportunities' });
  }
}

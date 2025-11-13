//создаем все нужные объекты один раз для каждого теста

import { test as base, expect } from '@playwright/test';
import { MainPage, RegisterPage, ArticlePage, SettingsPage } from '../pages/index.js';

export const test = base.extend({
  app: async ({ page }, use) => {
    const app = {
      main: new MainPage(page),
      register: new RegisterPage(page),
      article: new ArticlePage(page),
      settings: new SettingsPage(page),
    };
    await use(app);
  },
});

export { expect };
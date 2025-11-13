//создаем все нужные объекты один раз для каждого теста

import { test as base, expect } from '@playwright/test';
import { MainPage, RegisterPage, ArticleEditorPage, ArticleViewPage, SettingsPage } from '../pages/index.js';

export const test = base.extend({
  app: async ({ page }, use) => {
    const app = {
      main: new MainPage(page),
      register: new RegisterPage(page),
      articleEditor: new ArticleEditorPage(page),
      articleView: new ArticleViewPage(page),
      settings: new SettingsPage(page),
    };
    await use(app);
  },
});

export { expect };
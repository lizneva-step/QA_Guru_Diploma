// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  /* Запуск параллельно */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,

  /* Репортеры */
  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  /* Общие настройки */
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    expectTimeout: 5_000,
  },

  /* Настройка проектов */
  projects: [
    {
      name: 'API Tests',
      testMatch: 'api/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://apichallenges.herokuapp.com',
      },
    },
    {
      name: 'UI Tests',
      testMatch: 'ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://realworld.qa.guru/',
      },
    },
  ],
});

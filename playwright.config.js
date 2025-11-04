// // @ts-check
// import { defineConfig, devices } from '@playwright/test';

// /**
//  * @see https://playwright.dev/docs/test-configuration
//  */
// export default defineConfig({
//   testDir: './tests',
//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : 2,
//   reporter: [['line'], ['allure-playwright', {
//       detail: true,
//       resultsDir: "allure-results",
//       suiteTitle: false
//     }]
//   ],
//   use: {
//     //baseURL: 'https://apichallenges.herokuapp.com/',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     trace: 'on-first-retry',
//     actionTimeout: 10 * 1000, // 10 секунд на каждое действие (click, fill)
//     navigationTimeout: 15 * 1000, // 15 секунд на переходы (page.goto)
//     expectTimeout: 5 * 1000, // 5 секунд на ожидания (expect)
//   },

//   projects: [
//     {
//       name: 'QA-Guru-Classes-and-PO-Pattern-homework',
//       testMatch: '**/UI/**/*.spec.js',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'https://realworld.qa.guru/',  
//       },
//     },
//     {
//       name: 'QA-Guru-API-Challenges-homework',
//       testMatch: '**/API/**/*.spec.js',
//       use: { 
//         ...devices['Desktop Chrome'],
//         baseURL: 'https://apichallenges.herokuapp.com/',  
//       },
//     },
//   ],
// });


// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["line"], ["html", { open: "never" }], ["allure-playwright"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'QA-Guru-Classes-and-PO-Pattern-homework',
    //   testMatch: '**/*.spec.js',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'https://realworld.qa.guru/',  
    //   },
    // },
    {
      name: 'QA-Guru-API-Challenges-homework',
      testMatch: '**/*.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://apichallenges.herokuapp.com',  
      },
    }
  ],
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
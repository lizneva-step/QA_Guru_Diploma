// тест1. Пользователю доступны табы Your Feed, Global Feed после регистрации
// 0. Зарегистрироваться
// 1. Проверить 1 табу название
// 2. Проверить 1 табу текст
// 3. Перейти к 2 табе
// 4. Проверить 2 табу название
// 5. Проверить 2 табу: проверяем, что есть 3 элемента (поста)

import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";
//import { MainPage, RegisterPage } from "../../src/pages/index";
const URL = "https://realworld.qa.guru/";

test.describe("Главная страница", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователю доступны табы Your Feed, Global Feed после регистрации", async ({
    page, app
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // 0. Зарегистрироваться
    const { main, register } = app;

    await main.gotoRegister();
    await register.register(user);

    // 1. Проверить 1 табу название
    await expect(main.tabYourFeed).toBeVisible();
    await expect(main.tabYourFeed).toHaveText("Your Feed");

    // 2. Проверить 1 табу: текст Articles not available
    await expect(main.tabYourFeedText).toBeVisible();

    // 3. Перейти к 2 табе
    await main.clickGlobalFeedButton();

    // 4. Проверить 2 табу название
    await expect(main.tabGlobalFeed).toBeVisible();
    await expect(main.tabGlobalFeed).toHaveText("Global Feed");

    // 5. Проверить 2 табу: проверяем, что есть 3 элемента (поста)
    await expect(main.tabGlobalFeedText).toHaveCount(3);
  });
});

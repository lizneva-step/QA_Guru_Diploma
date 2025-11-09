// тест1. Пользователю доступны табы Your Feed, Global Feed после регистрации
// 0. Зарегистрироваться
// 1. Проверить 1 табу название
// 2. Проверить 1 табу текст
// 3. Перейти к 2 табе
// 4. Проверить 2 табу название
// 5. Проверить 2 табу: проверяем, что есть 3 элемента (поста)

import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { MainPage, RegisterPage } from "../../src/pages/index";
const URL = "https://realworld.qa.guru/";

test.describe("Главная страница", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователю доступны табы Your Feed, Global Feed после регистрации", async ({
    page,
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Проверить 1 табу название
    await expect(mainPage.tabYourFeed).toBeVisible();
    await expect(mainPage.tabYourFeed).toHaveText("Your Feed");

    // 2. Проверить 1 табу: текст Articles not available
    await expect(mainPage.tabYourFeedText).toBeVisible();

    // 3. Перейти к 2 табе
    await mainPage.clickGlobalFeedButton();

    // 4. Проверить 2 табу название
    await expect(mainPage.tabGlobalFeed).toBeVisible();
    await expect(mainPage.tabGlobalFeed).toHaveText("Global Feed");

    // 5. Проверить 2 табу: проверяем, что есть 3 элемента (поста)
    await expect(mainPage.tabGlobalFeedText).toHaveCount(3);
  });
});

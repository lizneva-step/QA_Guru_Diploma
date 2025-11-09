import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { MainPage, RegisterPage, SettingsPage } from "../../src/pages/index";

const URL = "https://realworld.qa.guru/";

test.describe("Обновление профиля", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может обновить имя и почту в профиле", async ({
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
    const settingsPage = new SettingsPage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать на профиль (имя пользователя),
    await mainPage.clickUserDropdown();

    // 2. Нажать на пункт Профиль в имени пользователя
    await mainPage.clickUserDropdownProfile();

    // 3. Нажать редактировать настройки профиля пользователя
    await settingsPage.clickEditProfileSettingsButton();

    // 4. Проверить заголовок
    await expect(settingsPage.settingsHeader).toBeVisible();

    // 5. Обновить имя и почту в профиле (все в одном методе)
    const newName = faker.person.fullName();
    const newEmail = faker.internet.email();
    
    // Все действия по заполнению и обновлению в одном методе
    await settingsPage.updateProfileFields(newName, newEmail);

    // 6. Проверить что апдейт сеттингс не отображается (страница обновилась без ошибок)
    await expect(settingsPage.updateSettingsButton).not.toBeVisible();

    // 7. Проверить что имя профиля новое (рядом с тогглом)
    await expect(mainPage.userDropdown).toHaveText(newName);

    // 8. Проверить что в инпуте предзаполнено новое имя
    await expect(settingsPage.yourNameInput).toHaveValue(newName);

    // 9. Проверить что в инпуте предзаполнена новая почта
    await expect(settingsPage.emailInput).toHaveValue(newEmail);
  });
});
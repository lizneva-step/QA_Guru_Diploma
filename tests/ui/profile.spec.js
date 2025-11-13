import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";
//import { MainPage, RegisterPage, SettingsPage } from "../../src/pages/index";

const URL = "https://realworld.qa.guru/";

test.describe("Обновление профиля", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может обновить имя и почту в профиле", async ({
    page, app
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // 0. Зарегистрироваться
    const { main, register, article, settings } = app;

    await main.gotoRegister();
    await register.register(user);

    // 1. Нажать на профиль (имя пользователя),
    await main.clickUserDropdown();

    // 2. Нажать на пункт Профиль в имени пользователя
    await main.clickUserDropdownProfile();

    // 3. Нажать редактировать настройки профиля пользователя
    await settings.clickEditProfileSettingsButton();

    // 4. Проверить заголовок
    await expect(settings.settingsHeader).toBeVisible();

    // 5. Обновить имя и почту в профиле (все в одном методе)
    const newName = faker.person.fullName();
    const newEmail = faker.internet.email();
    
    // Все действия по заполнению и обновлению в одном методе
    await settings.updateProfileFields(newName, newEmail);

    // 6. Проверить что апдейт сеттингс не отображается (страница обновилась без ошибок)
    await expect(settings.updateSettingsButton).not.toBeVisible();

    // 7. Проверить что имя профиля новое (рядом с тогглом)
    await expect(main.userDropdown).toHaveText(newName);

    // 8. Проверить что в инпуте предзаполнено новое имя
    await expect(settings.yourNameInput).toHaveValue(newName);

    // 9. Проверить что в инпуте предзаполнена новая почта
    await expect(settings.emailInput).toHaveValue(newEmail);
  });
});
import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";
import { UserBuilder } from "../../src/builders/index.js";

test.describe("Обновление профиля", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("Пользователь может обновить имя и почту в профиле", async ({
    page, app
  }) => {
    // Arrange - явная подготовка данных через Builder
    const user = new UserBuilder()
      .addName(faker.person.fullName())
      .addEmail(faker.internet.email())
      .addPassword(faker.internet.password())
      .generate();

    const { main, register, article, settings } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать на профиль (имя пользователя)
    await main.clickUserDropdown();
    
    // Нажать на пункт Профиль в имени пользователя
    await main.clickUserDropdownProfile();
    
    // Нажать редактировать настройки профиля пользователя
    await settings.clickEditProfileSettingsButton();
    
    // Обновить имя и почту в профиле
    const newName = faker.person.fullName();
    const newEmail = faker.internet.email();
    await settings.updateProfileFields(newName, newEmail);

    // Assert - проверка результатов (позитивный тест - проверяем все поля по максимуму)
    await expect(settings.settingsHeader).toBeVisible();
    await expect(settings.updateSettingsButton).not.toBeVisible();
    await expect(main.userDropdown).toHaveText(newName);
    await expect(settings.yourNameInput).toHaveValue(newName);
    await expect(settings.emailInput).toHaveValue(newEmail);
  });
});
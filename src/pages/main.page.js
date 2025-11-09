import { test, expect } from "@playwright/test";
export class MainPage {
  constructor(page) {
    //техническое описание страницы (из каких селекторов и локаторов она состоит)
    //страничка - драйвер
    //техническое описание страницы

    this.page = page;
    this.signupLink = page.getByRole("link", { name: "Sign up" });
    this.loginLink = page.getByRole("link", { name: "Login" });

    this.userDropdown = page.locator(
      ".nav-link.dropdown-toggle.cursor-pointer"
    );
    this.userDropdownProfile = page.locator(
      'a.dropdown-item[href*="/profile/"]'
    );

    this.tabYourFeed = page.getByRole("button", { name: "Your Feed" });
    this.tabYourFeedText = page.locator(
      "div.article-preview >> text=Articles not available."
    );
    this.tabGlobalFeed = page.getByRole("button", { name: "Global Feed" });
    // this.tabGlobalFeed = page.locator(
    //   'button.nav-link:has-text("Global Feed")'
    // );
    this.tabGlobalFeedText = page.locator('a.author[href*="/profile/"]');

    this.newArticleButton = page.getByRole("link", { name: "New Article" });
    //this.homeButton = page.getByRole("link", { name: "Home" });
    this.homeButton = page.getByRole("link", { name: "Home" }).nth(0);
    this.articleTitle = page.locator("div.article-preview h1");
  }
  //методы
  //бизнесовые действия со страницей
  //оборачиваем для шагов в отчете аллюр

  async gotoRegister() {
    return test.step("Переход на страницу регистрации", async (step) => {
      await this.signupLink.waitFor({ state: "visible" });
      await this.signupLink.click();
    });
  }

  async clickUserDropdown() {
    return test.step("Переход в выпадающее меню опций пользователя (профиль, настройки, логаут)", async (step) => {
      await this.userDropdown.click();
    });
  }

  async clickUserDropdownProfile() {
    return test.step("Переход в раздел Профиль в выпадающем меню пользователя", async (step) => {
      await this.userDropdownProfile.click();
    });
  }

  async clickYourFeedButton() {
    return test.step("Переход в табу Your Feed", async (step) => {
      await this.tabYourFeed.click();
    });
  }

  async clickGlobalFeedButton() {
    return test.step("Переход в табу Global Feed", async (step) => {
      await this.tabGlobalFeed.waitFor({ state: "visible" });
      await this.tabGlobalFeed.click();
    });
  }

  async clickHomeButton() {
    return test.step("Переход на домашнюю страницу", async (step) => {
      await this.homeButton.click();
    });
  }

  // async clickGlobalFeedButton() {
  //   return test.step("Переход в табу Global Feed", async (step) => {
  //     // Используем более универсальный селектор
  //     const globalFeedButton = this.page.locator(
  //       'button.nav-link:has-text("Global Feed"), a.nav-link:has-text("Global Feed")'
  //     );

  //     // Если кнопка не найдена, ждем немного и пробуем снова
  //     try {
  //       await globalFeedButton.waitFor({ timeout: 5000, state: "visible" });
  //       await globalFeedButton.click();
  //     } catch {
  //       // Если не нашли, используем альтернативный подход
  //       await this.page.click("text=Global Feed");
  //     }
  //   });
  // }

  async clickNewArticleButton() {
    return test.step("Переход к созданию новой заметки", async (step) => {
      await this.newArticleButton.click();
      await expect(this.page).toHaveURL(/\/editor/);
    });
  }
}

// this.signupLink = page.getByRole("link", { name: "Sign up" });
//вот эту строчку взяли из теста и занесли в конструктор страницы
//const SIGNUP_LINK_TEXT = "Sign up";
// await page.getByRole("link", { name: SIGNUP_LINK_TEXT }).click();

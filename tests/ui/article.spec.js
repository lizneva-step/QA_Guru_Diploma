import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  MainPage,
  RegisterPage,
 // EditorPage,
  ArticlePage,
} from "../../src/pages/index";

const URL = "https://realworld.qa.guru/";

test.describe("Действия со статьёй", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может создать новую статью", async ({ page }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const articleData = {
      title: faker.lorem.sentence(3),
      about: faker.lorem.sentence(5),
      body: faker.lorem.paragraphs(3),
      tags: faker.lorem.word(),
    };

    /// 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    const articlePage = new ArticlePage(page); // Исправлено: теперь правильно

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать новая заметка
    await mainPage.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await articlePage.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await articlePage.clickPublishArticleButton();

    // 4. Проверить имя, описание, текст, тег
    await expect(articlePage.articleTitle).toBeVisible();
    await expect(articlePage.articleText).toBeVisible();
    await expect(articlePage.tags).toBeVisible();
  });

  test("Пользователь может оставить комментарий под статьёй", async ({
    page,
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const articleData = {
      title: faker.lorem.sentence(3),
      about: faker.lorem.sentence(5),
      body: faker.lorem.paragraphs(3),
      tags: faker.lorem.word(),
    };

    /// 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    const articlePage = new ArticlePage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать новая заметка
    await mainPage.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await articlePage.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await articlePage.clickPublishArticleButton();

    // 4. Создаем экземпляр ArticlePage (уже создан выше)
    // 5. Ввести комментарий и отправить
    const commentText = faker.lorem.sentence(2);
    await articlePage.addComment(commentText);

    // 6. Проверить что отображается комментарий
    await articlePage.checkCommentDisplayed(commentText);

    // 7. Проверить что отображается пользователь
    await articlePage.checkAuthorDisplayed(user.name);
  });

  test("Пользователь может удалить статью", async ({ page }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const articleData = {
      title: faker.lorem.sentence(3),
      about: faker.lorem.sentence(5),
      body: faker.lorem.paragraphs(3),
      tags: faker.lorem.word(),
    };

    /// 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    //const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать новая заметка
    await mainPage.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await articlePage.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await articlePage.clickPublishArticleButton();

    // 4. Создаем экземпляр ArticlePage (уже создан выше)
    // 5. Нажать Delete Article
    await articlePage.deleteArticle();

    // 6. Подтвердить действие (нажать ок) с browser dialogs
    await articlePage.handleDeleteConfirmationDialog();

    // 7. Перейти на домашнюю страницу
    await mainPage.clickHomeButton();

    // 8. Перейти в глобал фид
    await mainPage.clickGlobalFeedButton();

    // 9. Проверить что заметка не отображается
    await articlePage.waitForArticleToDisappear(articleData.title);
  });
});

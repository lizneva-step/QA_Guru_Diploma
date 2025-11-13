import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";
import {
  // MainPage,
  // RegisterPage,
  // ArticlePage,
} from "../../src/pages/index";

const URL = "https://realworld.qa.guru/";

test.describe("Действия со статьёй", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может создать новую статью", async ({ page, app }) => {
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
    const { main, register, article } = app;

    await main.gotoRegister();
    await register.register(user);

    // 1. Нажать новая заметка
    await main.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await article.clickPublishArticleButton();

    // 4. Проверить имя, описание, текст, тег
    await expect(article.articleTitle).toBeVisible();
    await expect(article.articleText).toBeVisible();
    await expect(article.tags).toBeVisible();
  });

  test("Пользователь может оставить комментарий под статьёй", async ({
    page, app
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
    const { main, register, article } = app;

    await main.gotoRegister();
    await register.register(user);

    // 1. Нажать новая заметка
    await main.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await article.clickPublishArticleButton();

    // 4. Создаем экземпляр article (уже создан выше)
    // 5. Ввести комментарий и отправить
    const commentText = faker.lorem.sentence(2);
    await article.addComment(commentText);

    // 6. Проверить что отображается комментарий
    await article.checkCommentDisplayed(commentText);

    // 7. Проверить что отображается пользователь
    await article.checkAuthorDisplayed(user.name);
  });

  test("Пользователь может удалить статью", async ({ page, app }) => {
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
    const { main, register, article } = app;

    await main.gotoRegister();
    await register.register(user);

    // 1. Нажать новая заметка
    await main.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);

    // 3. Нажать публиковать
    await article.clickPublishArticleButton();

    // 4. Создаем экземпляр article (уже создан выше)
    // 5. Нажать Delete Article
    await article.deleteArticle();

    // 6. Подтвердить действие (нажать ок) с browser dialogs
    await article.handleDeleteConfirmationDialog();

    // 7. Перейти на домашнюю страницу
    await main.clickHomeButton();

    // 8. Перейти в глобал фид
    await main.clickGlobalFeedButton();

    // 9. Проверить что заметка не отображается
    await article.waitForArticleToDisappear(articleData.title);
  });
});


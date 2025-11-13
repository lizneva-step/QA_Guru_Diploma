import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";

const URL = "https://realworld.qa.guru/";

test.describe("Действия со статьёй", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может создать новую статью", async ({ page, app }) => {
    // Arrange - явная подготовка данных
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

    const { main, register, article } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);
    
    // Нажать публиковать
    await article.clickPublishArticleButton();

    // Assert - проверка результатов (позитивный тест - проверяем все поля по максимуму)
    await expect(article.articleTitle).toBeVisible();
    await expect(article.articleText).toBeVisible();
    await expect(article.tags).toBeVisible();
    
    // Дополнительные проверки по максимуму
    await expect(article.articleTitle).toContainText(articleData.title);
    await expect(article.articleText).toContainText(articleData.body);
    await expect(article.tags).toContainText(articleData.tags);
  });

  test("Пользователь может оставить комментарий под статьёй", async ({
    page, app
  }) => {
    // Arrange - явная подготовка данных
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

    const { main, register, article } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);
    
    // Нажать публиковать
    await article.clickPublishArticleButton();
    
    // Ввести комментарий и отправить
    const commentText = faker.lorem.sentence(2);
    await article.addComment(commentText);

    // Assert - проверка результатов (позитивный тест - проверяем все поля по максимуму)
    await article.checkCommentDisplayed(commentText);
    await article.checkAuthorDisplayed(user.name);
  });

  test("Пользователь может удалить статью", async ({ page, app }) => {
    // Arrange - явная подготовка данных
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

    const { main, register, article } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Ввести имя, описание, текст, тег
    await article.fillArticleForm(articleData);
    
    // Нажать публиковать
    await article.clickPublishArticleButton();
    
    // Нажать Delete Article
    await article.deleteArticle();
    
    // Подтвердить действие (нажать ок) с browser dialogs
    await article.handleDeleteConfirmationDialog();
    
    // Перейти на домашнюю страницу
    await main.clickHomeButton();
    
    // Перейти в глобал фид
    await main.clickGlobalFeedButton();
    
    // Проверить что заметка не отображается
    await article.waitForArticleToDisappear(articleData.title);

    // Assert - проверка результатов (позитивный тест - проверяем все поля по максимуму)
    // Все проверки уже выполнены выше
  });
});
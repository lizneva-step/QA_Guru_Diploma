import { test, expect } from "../../src/fixtures/fixture.js";
import { faker } from "@faker-js/faker";
import { UserBuilder } from "../../src/builders/index.js";
import { ArticleBuilder } from "../../src/builders/index.js";

test.describe("Действия со статьёй", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("Пользователь может создать новую статью", async ({ page, app }) => {
    // Arrange - явная подготовка данных через Builders
    const user = new UserBuilder()
      .addName(faker.person.fullName())
      .addEmail(faker.internet.email())
      .addPassword(faker.internet.password())
      .generate();
    
    const articleData = new ArticleBuilder()
      .addTitle(faker.lorem.sentence(3))
      .addAbout(faker.lorem.sentence(5))
      .addBody(faker.lorem.paragraphs(3))
      .addTags(faker.lorem.word())
      .generate();

    const { main, register, articleEditor, articleView } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Создание и публикация статьи
    await articleEditor.createAndPublishArticle(articleData);

    // Assert - проверка результатов 
    await expect(articleView.articleTitle).toBeVisible();
    await expect(articleView.articleText).toBeVisible();
    await expect(articleView.tags).toBeVisible();    
    await expect(articleView.articleTitle).toContainText(articleData.title);
    await expect(articleView.articleText).toContainText(articleData.body);
    await expect(articleView.tags).toContainText(articleData.tags);
  });

  test("Пользователь может оставить комментарий под статьёй", async ({
    page, app
  }) => {
    // Arrange - явная подготовка данных через Builders
    const user = new UserBuilder()
      .addName(faker.person.fullName())
      .addEmail(faker.internet.email())
      .addPassword(faker.internet.password())
      .generate();
    
    const articleData = new ArticleBuilder()
      .addTitle(faker.lorem.sentence(3))
      .addAbout(faker.lorem.sentence(5))
      .addBody(faker.lorem.paragraphs(3))
      .addTags(faker.lorem.word())
      .generate();

    const { main, register, articleEditor, articleView } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Создание и публикация статьи
    await articleEditor.createAndPublishArticle(articleData);
    
    // Ввести комментарий и отправить
    const commentText = faker.lorem.sentence(2);
    await articleView.addComment(commentText);

    // Assert - проверка результатов 
    await articleView.checkCommentDisplayed(commentText);
    await articleView.checkAuthorDisplayed(user.name);
  });

  test("Пользователь может удалить статью", async ({ page, app }) => {
    // Arrange - явная подготовка данных через Builders
    const user = new UserBuilder()
      .addName(faker.person.fullName())
      .addEmail(faker.internet.email())
      .addPassword(faker.internet.password())
      .generate();
    
    const articleData = new ArticleBuilder()
      .addTitle(faker.lorem.sentence(3))
      .addAbout(faker.lorem.sentence(5))
      .addBody(faker.lorem.paragraphs(3))
      .addTags(faker.lorem.word())
      .generate();

    const { main, register, articleEditor, articleView } = app;

    // Act - выполнение действий
    await main.gotoRegister();
    await register.register(user);
    
    // Нажать новая заметка
    await main.clickNewArticleButton();
    
    // Создание и публикация статьи
    await articleEditor.createAndPublishArticle(articleData);
    
    // Нажать Delete Article
    await articleView.deleteArticle();
    
    // Подтвердить действие (нажать ок) с browser dialogs
    await articleView.handleDeleteConfirmationDialog();
    
    // Перейти на домашнюю страницу
    await main.clickHomeButton();
    
    // Перейти в глобал фид
    await main.clickGlobalFeedButton();
    
    // Проверить что заметка не отображается
    await articleView.waitForArticleToDisappear(articleData.title);

    // Assert - проверка результатов 
    // Все проверки уже выполнены выше
  });
});
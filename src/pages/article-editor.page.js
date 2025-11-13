import { test } from "@playwright/test";

export class ArticleEditorPage {
  constructor(page) {
    // Для редактора
    this.page = page;
    this.inputArticleTitle = page.locator(
      'input.form-control.form-control-lg[name="title"]'
    );
    this.inputAbout = page.locator('input.form-control[name="description"]');
    this.inputArticleText = page.locator('textarea.form-control[name="body"]');
    this.inputTags = page.locator('input.form-control[name="tags"]');
    this.publishArticleButton = page.locator(
      'button.btn.btn-lg.pull-xs-right.btn-primary:has-text("Publish Article")'
    );
  }

  // Бизнесовые действия со страницей редактора
    async createAndPublishArticle(articleData) {
        return test.step("Создание и публикация статьи", async (step) => {
        await this.inputArticleTitle.fill(articleData.title);
        await this.inputAbout.fill(articleData.about);
        await this.inputArticleText.fill(articleData.body);
        await this.inputTags.fill(articleData.tags);
        await this.publishArticleButton.click();
    });
  }
}
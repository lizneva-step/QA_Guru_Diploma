import { faker } from '@faker-js/faker';

export class ArticleBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.data = {
      title: "",
      about: "",
      body: "",
      tags: ""
    };
    return this;
  }

  addTitle(title = null) {
    this.data.title = title || faker.lorem.sentence(3);
    return this;
  }

  addAbout(about = null) {
    this.data.about = about || faker.lorem.sentence(5);
    return this;
  }

  addBody(body = null) {
    this.data.body = body || faker.lorem.paragraphs(3);
    return this;
  }

  addTags(tags = null) {
    this.data.tags = tags || faker.lorem.word();
    return this;
  }

  generate() {
    const result = { ...this.data };
    this.reset();
    return result;
  }
}
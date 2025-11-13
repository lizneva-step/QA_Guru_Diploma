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

  addTitle(title = "") {
    this.data.title = title || faker.lorem.sentence(3);
    return this;
  }

  addAbout(about = "") {
    this.data.about = about || faker.lorem.sentence(5);
    return this;
  }

  addBody(body = "") {
    this.data.body = body || faker.lorem.paragraphs(3);
    return this;
  }

  addTags(tags = "") {
    this.data.tags = tags || faker.lorem.word();
    return this;
  }

  generate() {
    const result = { ...this.data };
    this.reset();
    return result;
  }
}
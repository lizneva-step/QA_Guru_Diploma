import { faker } from '@faker-js/faker';

export class toDoBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.data = {
      title: "",
      doneStatus: false,
      description: ""
    };
    return this;
  }

  addTitle(title = null) {
    this.data.title = title || faker.lorem.words(3);
    return this;
  }

  addDoneStatus(doneStatus = false) {
    this.data.doneStatus = doneStatus;
    return this;
  }

  addDescription(description = null) {
    this.data.description = description || faker.lorem.sentence();
    return this;
  }

  moreThanMaxLengthTitle() {
    // Генерируем строку длиной 51 символ динамически
    this.data.title = faker.string.alpha({ length: 51 });
    return this;
  }

  withTooLongDescription() {
    // Генерируем описание длиной 201 символ динамически
    this.data.description = faker.string.alpha({ length: 201 });
    return this;
  }

  withMaxLengthTitle() {
    // Генерируем строку длиной 45 символов (примерно как в оригинале)
    this.data.title = faker.string.alpha({ length: 45 });
    return this;
  }

  withMaxLengthDescription() {
    // Генерируем описание длиной 200 символов динамически
    this.data.description = faker.string.alpha({ length: 200 });
    return this;
  }

  withExactMaxLengthDescription() {
    // Генерируем описание длиной 5000 символов динамически
    this.data.description = faker.string.alpha({ length: 5000 });
    return this;
  }

  withMinimalUpdateData() {
    this.data = {
      title: "updated title"
    };
    return this;
  }

  generate() {
    const result = { ...this.data };
    this.reset();
    return result;
  }
}
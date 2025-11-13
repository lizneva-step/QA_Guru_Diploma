import { faker } from '@faker-js/faker';

export class UserBuilder {
  addEmail(email = null) {
    this.email = email || faker.internet.email();
    return this;
  }
  
  addName(name = null) {
    this.name = name || faker.person.fullName();
    return this;
  }
  
  addPassword(password = null) {
    this.password = password || faker.internet.password({ length: 10 });
    return this;
  }
  
  generate() {
    // Деструктуризация убивает неиспользуемые поля
    return { ...this };
  }
}
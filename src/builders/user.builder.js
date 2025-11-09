import { faker } from '@faker-js/faker';

export class UserBuilder {
	addEmail() {
		this.email = faker.internet.email();
		return this;
	}
	addName() {
		this.name = faker.person.fullName();
		return this;
	}
	addPassword(symbol = 10) {
		this.password = faker.internet.password({ length: symbol });
		return this;
	}
	generate() {
		// Деструктуризация убивает неиспользуемые поля
		return { ...this };
	}

	/* const user = {
			email: this.email,
			name: this.name,
			password: this.password,
		};

		return user;
	/*	return {
			email: this.email,
			name: this.name,
			password: this.password,
		};
	} */
}
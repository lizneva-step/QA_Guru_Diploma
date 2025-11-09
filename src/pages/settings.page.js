export class SettingsPage {
	constructor(page) {
		// техническое описание страницы
        this.page = page;
        this.settingsHeader = page.getByRole('heading', { name: 'Settings' });
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
        this.yourNameInput = page.getByRole('textbox', { name: 'Your Name' });
		this.emailInput = page.getByRole('textbox', { name: 'Email' });
		this.passwordInput = page.getByRole('textbox', { name: 'Password' });
	}
	
	// Добавим метод для обновления полей профиля
	async updateProfileFields(newName, newEmail) {
		// Очистить имя
		await this.yourNameInput.clear();
		
		// Ввести имя
		await this.yourNameInput.fill(newName);
		
		// Очистить почту
		await this.emailInput.clear();
		
		// Ввести почту
		await this.emailInput.fill(newEmail);
		
		// Нажать обновить настройки
		await this.updateSettingsButton.click();
	}
	
	// Метод для клика на кнопку редактирования настроек профиля
	async clickEditProfileSettingsButton() {
		// На странице профиля есть ссылка "Edit Profile Settings"
		const editProfileSettingsButton = this.page.getByRole('link', { name: 'Edit Profile Settings' });
		await editProfileSettingsButton.click();
	}
}
export class ProfilePage {
	constructor(page) {
		// техническое описание страницы
		this.page = page;
		this.editProfileButton = page.getByRole('link', { name: 'Edit Profile Settings' });
        this.profileHeader = page.getByRole('heading', { name: 'Settings' });
        this.tabMyArticles = page.getByRole('link', { name: 'My Articles' });
		this.tabFavorArticles = page.getByRole('link', { name: 'Favorited Articles' });
		this.tabMyArticlesText = page.locator('[data-testid="my-articles"]');
		this.tabFavorArticlesText = page.locator('[data-testid="favorited-articles"]');
	}
	
	// Метод для перехода к редактированию профиля
	async goToEditProfile() {
		await this.editProfileButton.click();
	}
}
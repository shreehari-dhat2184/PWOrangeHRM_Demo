const { BasePage } = require('./BasePage');

class AdminPage extends BasePage {
  async openSystemUsers() {
    await this.page.goto('/web/index.php/admin/viewSystemUsers', { waitUntil: 'domcontentloaded' });
    await this.page.getByRole('heading', { name: 'System Users' }).waitFor();
  }

  async searchUsername(username) {
    await this.usernameInput().fill(username);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
  }

  async openAddUserForm() {
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('heading', { name: 'Add User' }).waitFor();
  }

  usernameInput() {
    return this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .getByRole('textbox');
  }
}

module.exports = { AdminPage };

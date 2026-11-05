const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  async open() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}

module.exports = { LoginPage };

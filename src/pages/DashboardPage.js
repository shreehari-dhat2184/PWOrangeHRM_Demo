const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  async open() {
    await this.page.goto('/web/index.php/dashboard/index');
  }

  async openAdmin() {
    await this.openModule('Admin', 'admin');
  }

  async openPim() {
    await this.openModule('PIM', 'pim');
  }

  async openLeave() {
    await this.openModule('Leave', 'leave');
  }
}

module.exports = { DashboardPage };

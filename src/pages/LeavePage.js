const { BasePage } = require('./BasePage');

class LeavePage extends BasePage {
  async openLeaveModule() {
    await this.page.goto('/web/index.php/leave/viewLeaveList', { waitUntil: 'domcontentloaded' });
  }

  async openApplyLeave() {
    await this.page.goto('/web/index.php/leave/applyLeave');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden' });
  }

  async openAssignLeave() {
    await this.page.goto('/web/index.php/leave/assignLeave');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden' });
  }

  async selectEmployee(fullName) {
    const employeeInput = this.page.getByRole('textbox', { name: 'Type for hints...' });
    await employeeInput.fill(fullName);
    const suggestion = this.page.getByRole('option').filter({ hasText: fullName });
    await suggestion.waitFor();
    await suggestion.click();
  }
}

module.exports = { LeavePage };

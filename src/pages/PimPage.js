const { BasePage } = require('./BasePage');

class PimPage extends BasePage {
  async openEmployeeList() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
    await this.page.getByRole('heading', { name: 'Employee Information' }).waitFor();
  }

  async openAddEmployee() {
    await this.page.goto('/web/index.php/pim/addEmployee', { waitUntil: 'domcontentloaded' });
    await this.page.getByRole('textbox', { name: 'First Name' }).waitFor();
  }

  async saveEmployee({ employeeId, firstName, lastName }) {
    await this.employeeIdInput().fill(employeeId);
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    await this.page.waitForURL(
      /\/web\/index\.php\/pim\/viewPersonalDetails\/empNumber\/\d+/,
      { waitUntil: 'domcontentloaded' }
    );
  }

  async searchByEmployeeId(employeeId) {
    await this.openEmployeeList();
    await this.employeeIdInput().fill(employeeId);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
  }

  async deleteEmployeeById(employeeId, { firstName, lastName }) {
    await this.openEmployeeList();
    await this.employeeIdInput().fill(employeeId);
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();

    const row = this.page.getByRole('row').filter({ hasText: employeeId });
    if (await row.count() === 0) {
      return;
    }

    if (
      await row.getByText(firstName, { exact: true }).count() === 0 ||
      await row.getByText(lastName, { exact: true }).count() === 0
    ) {
      throw new Error(
        `Refusing to delete employee ${employeeId}: the record does not match this test's data.`
      );
    }

    await row.locator('button').filter({
      has: this.page.locator('.bi-trash')
    }).click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await row.waitFor({ state: 'detached' });
  }

  employeeIdInput() {
    return this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .getByRole('textbox');
  }
}

module.exports = { PimPage };

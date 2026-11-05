const { test, expect } = require('../fixtures/test');
const { employeeData } = require('../data/test-data');

test('LEAVE-01 | applying without required fields shows validation', async ({ app, page }) => {
  await app.leave.openLeaveModule();
  await app.leave.openApplyLeave();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();

  await expect(page.getByText('Required', { exact: true }).first()).toBeVisible();
});

test('LEAVE-02 | PIM-created employee is available for leave assignment', async ({ app, page }) => {
  const data = employeeData();
  await app.pim.openAddEmployee();
  const employeeId = data.employeeId;

  try {
    await app.pim.saveEmployee(data);
    await app.leave.openAssignLeave();
    await app.leave.selectEmployee(data.fullName);

    await expect(page.getByRole('textbox', { name: 'Type for hints...' }))
      .toHaveValue(new RegExp(data.firstName));
  } finally {
    await app.pim.deleteEmployeeById(employeeId, data);
  }
});

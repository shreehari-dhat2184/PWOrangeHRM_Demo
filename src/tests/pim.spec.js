const { test, expect } = require('../fixtures/test');
const { employeeData } = require('../data/test-data');

test('PIM-01 | employee list opens from side navigation', async ({ app, page }) => {
  await app.pim.openEmployeeList();

  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
});

test('PIM-02 | blank employee names show required validation', async ({ app, page }) => {
  await app.pim.openAddEmployee();
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByText('Required', { exact: true }).first()).toBeVisible();
});

test('PIM-03 | employee can be created, found, and cleaned up', async ({ app, page }) => {
  const data = employeeData();
  await app.pim.openAddEmployee();
  const employeeId = data.employeeId;

  try {
    await app.pim.saveEmployee(data);
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    await app.pim.searchByEmployeeId(employeeId);
    const row = page.getByRole('row').filter({ hasText: employeeId });
    await expect(row).toBeVisible();
    await expect(row).toContainText(data.firstName);
    await expect(row).toContainText(data.lastName);
  } finally {
    await app.pim.deleteEmployeeById(employeeId, data);
  }
});

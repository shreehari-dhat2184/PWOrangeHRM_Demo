const { test, expect } = require('../fixtures/test');
const { nonexistentUsername } = require('../data/test-data');

test('ADMIN-01 | administrator can open system-user management', async ({ app, page }) => {
  await app.admin.openSystemUsers();

  await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
});

test('ADMIN-02 | unknown username search shows no records', async ({ app, page }) => {
  await app.admin.openSystemUsers();
  await app.admin.searchUsername(nonexistentUsername());

  await expect(page.getByText('No Records Found', { exact: true }).first()).toBeVisible();
});

test('ADMIN-03 | adding a user without required fields shows validation', async ({ app, page }) => {
  await app.admin.openSystemUsers();
  await app.admin.openAddUserForm();
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByText('Required', { exact: true }).first()).toBeVisible();
});

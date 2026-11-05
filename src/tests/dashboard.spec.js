const { test, expect } = require('../fixtures/test');

test('DASH-01 | dashboard displays main widgets', async ({ app, page }) => {
  await app.dashboard.open();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Time at Work', { exact: true })).toBeVisible();
  await expect(page.getByText('My Actions', { exact: true })).toBeVisible();
  await expect(page.getByText('Quick Launch', { exact: true })).toBeVisible();
});

test('DASH-02 | side navigation opens Admin, PIM, and Leave', async ({ app, page }) => {
  await app.dashboard.open();

  await app.dashboard.openAdmin();
  await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();

  await app.dashboard.openPim();
  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

  await app.dashboard.openLeave();
  await expect(page).toHaveURL(/\/web\/index\.php\/leave\//);
});

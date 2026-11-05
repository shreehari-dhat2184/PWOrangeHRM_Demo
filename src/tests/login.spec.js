const { test, expect } = require('../fixtures/test');
const { username, password } = require('../config/env');

test.use({ storageState: { cookies: [], origins: [] } });

test('LOGIN-01 | valid credentials open the dashboard', async ({ app, page }) => {
  await app.login.open();
  await app.login.login(username, password);

  await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('LOGIN-02 | empty credentials show required-field validation', async ({ app, page }) => {
  await app.login.open();
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Required', { exact: true })).toHaveCount(2);
  await expect(page).toHaveURL(/\/auth\/login/);
});

test('LOGIN-03 | incorrect password is rejected', async ({ app, page }) => {
  await app.login.open();
  await app.login.login(username, 'incorrect-password');

  await expect(page.getByText('Invalid credentials', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login/);
});

test('LOGIN-04 | forgot-password link opens reset form', async ({ app, page }) => {
  await app.login.open();
  await page.getByText('Forgot your password?', { exact: true }).click();

  await expect(page).toHaveURL(/\/auth\/requestPasswordResetCode/);
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
});

test('LOGIN-05 | OrangeHRM logo is visible and loaded', async ({ app, page }) => {
  await app.login.open();

  const logo = page.getByRole('img', { name: 'orangehrm-logo' });
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((image) => image.complete && image.naturalWidth > 0))
    .toBe(true);
});

test('LOGIN-06 | Login label is displayed', async ({ app, page }) => {
  await app.login.open();

  await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
});

test('LOGIN-07 | OrangeHRM copyright text and company link are displayed', async ({ app, page }) => {
  await app.login.open();

  await expect(page.getByText('OrangeHRM OS 5.9', { exact: true })).toBeVisible();
  const copyright = page.locator('p').filter({ hasText: '© 2005 - 2026' });
  await expect(copyright).toBeVisible();
  await expect(copyright).toContainText('OrangeHRM, Inc');
  await expect(copyright).toContainText('All rights reserved.');
  await expect(page.getByRole('link', { name: 'OrangeHRM, Inc', exact: true }))
    .toHaveAttribute('href', 'http://www.orangehrm.com');
});

test('LOGIN-08 | social media links are displayed with expected destinations', async ({ app, page }) => {
  await app.login.open();

  const socialLinkHrefs = [
    'https://www.linkedin.com/company/orangehrm/mycompany/',
    'https://www.facebook.com/OrangeHRM/',
    'https://twitter.com/orangehrm?lang=en',
    'https://www.youtube.com/c/OrangeHRMInc'
  ];

  for (const href of socialLinkHrefs) {
    await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
  }
});

const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('@playwright/test');
const { baseURL, username, password } = require('./src/config/env');

module.exports = async function globalSetup() {
  const authDirectory = path.join(__dirname, 'playwright', '.auth');
  const storageStatePath = path.join(authDirectory, 'user.json');
  await fs.mkdir(authDirectory, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL });
    await page.goto('/web/index.php/auth/login');
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/\/web\/index\.php\/dashboard\/index/);
    await page.context().storageState({ path: storageStatePath });
  } finally {
    await browser.close();
  }
};

require('dotenv').config();

const path = require('node:path');
const { defineConfig } = require('@playwright/test');
const { browsers, baseURL } = require('./src/config/env');

module.exports = defineConfig({
  testDir: './src/tests',
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 60_000,
  expect: {
    timeout: 7_000
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL,
    storageState: path.join(__dirname, 'playwright', '.auth', 'user.json'),
    headless: process.env.HEADED !== '1',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000
  },
  projects: browsers.map((browserName) => ({
    name: browserName,
    use: { browserName }
  }))
});

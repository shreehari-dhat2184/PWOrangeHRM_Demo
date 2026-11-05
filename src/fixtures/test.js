const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { AdminPage } = require('../pages/AdminPage');
const { PimPage } = require('../pages/PimPage');
const { LeavePage } = require('../pages/LeavePage');

const test = base.test.extend({
  app: async ({ page }, use) => {
    await use({
      login: new LoginPage(page),
      dashboard: new DashboardPage(page),
      admin: new AdminPage(page),
      pim: new PimPage(page),
      leave: new LeavePage(page)
    });
  }
});

module.exports = { test, expect: base.expect };

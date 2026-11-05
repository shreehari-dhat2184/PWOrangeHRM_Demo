class BasePage {
  constructor(page) {
    this.page = page;
  }

  async openModule(name, routeSegment) {
    if (!this.page.url().includes('/web/index.php/dashboard/index')) {
      await this.page.goto('/web/index.php/dashboard/index', { waitUntil: 'domcontentloaded' });
    }

    await this.page.getByRole('link', { name, exact: true }).click();
    await this.page.waitForURL(
      (url) => url.pathname.startsWith(`/web/index.php/${routeSegment}/`),
      { waitUntil: 'domcontentloaded' }
    );
  }
}

module.exports = { BasePage };

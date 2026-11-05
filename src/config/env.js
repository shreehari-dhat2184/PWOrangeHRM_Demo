const browsers = (process.env.BROWSERS || 'chromium')
  .split(',')
  .map((browser) => browser.trim())
  .filter(Boolean);

const supportedBrowsers = new Set(['chromium', 'firefox', 'webkit']);
const unsupportedBrowsers = browsers.filter((browser) => !supportedBrowsers.has(browser));

if (browsers.length === 0 || unsupportedBrowsers.length > 0) {
  throw new Error(
    `Invalid BROWSERS value. Use one or more of: chromium, firefox, webkit. ` +
    `Received: ${process.env.BROWSERS || '(empty)'}.`
  );
}

const requiredVariables = ['BASE_URL', 'ORANGEHRM_USERNAME', 'ORANGEHRM_PASSWORD'];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingVariables.join(', ')}. ` +
    'Copy .env.example to .env and configure the values.'
  );
}

module.exports = {
  baseURL: process.env.BASE_URL,
  username: process.env.ORANGEHRM_USERNAME,
  password: process.env.ORANGEHRM_PASSWORD,
  browsers
};

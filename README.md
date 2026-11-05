# OrangeHRM Playwright framework

JavaScript end-to-end tests for the OrangeHRM demo at
`https://opensource-demo.orangehrmlive.com`. Tests use Playwright Test, page
objects, an authenticated storage-state fixture, and generated employee data.

## Requirements and installation (Ubuntu)

Node.js and npm must be installed. From this project directory:

```bash
cp .env.example .env
npm install
sudo npx playwright install-deps chromium
npx playwright install chromium
```

`install-deps` installs the Ubuntu system packages needed by Chromium.
For Firefox and WebKit, install their dependencies and browsers too:

```bash
sudo npx playwright install-deps firefox webkit
npx playwright install firefox webkit
```

Configure `.env` with:

```dotenv
BASE_URL=https://opensource-demo.orangehrmlive.com
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=admin123
BROWSERS=chromium
```

The credentials above are OrangeHRM's publicly displayed demo credentials.
Change them to run against another permitted environment. Do not commit `.env`.
Playwright may not identify a future Ubuntu release by name; if dependency
installation reports an unsupported distribution, use the equivalent package
names reported by Playwright's installer with Ubuntu's `apt` package manager.

## Running tests

```bash
npm test                          # Headless; uses BROWSERS in .env
npm run test:headed               # Headed
npm run test:chromium             # Headless Chromium
npm run test:firefox              # Headless Firefox
npm run test:webkit               # Headless WebKit
npm run test:ui                   # Playwright UI runner
npm run test:debug                # Playwright Inspector
npx playwright test src/tests/pim.spec.js
npm run report                    # Open generated HTML report
```

Set `BROWSERS=chromium,firefox,webkit` in `.env` to run the configured test
projects on all three engines. The HTML report is written to
`playwright-report/`. Screenshots and retained traces for failed tests are in
`test-results/`. An authenticated browser state is generated at
`playwright/.auth/user.json`; these generated files are git-ignored.

CI behavior: set `CI=1` to enable two retries, cap workers at two, and fail if
any test uses `test.only`.

## GitHub Actions CI

The workflow at `.github/workflows/playwright.yml` runs the Chromium suite on
pushes, pull requests, and manual dispatch. It uses `npm ci`, installs the
Playwright browser and Ubuntu dependencies, and runs tests serially to reduce
load on the shared public OrangeHRM demo. Failed tests are retried according
to the Playwright CI configuration.

The HTML report and test results (including failure screenshots and traces)
are uploaded as workflow artifacts for 14 days, even when tests fail. Open the
completed workflow run in GitHub and download `playwright-html-report` or
`playwright-test-results`.

The workflow defaults to the public demo URL and its public demo credentials.
To test a different permitted instance, define the `BASE_URL` repository
variable and `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD` repository secrets
in GitHub Actions settings. This project tests an externally hosted app and
does not build or deploy the OrangeHRM application itself.

## Test case catalog

| ID | Title | Preconditions | Steps | Expected result |
|---|---|---|---|---|
| LOGIN-01 | Valid credentials open Dashboard | Login page; configured credentials are valid | Open login, enter configured username and password, submit | Dashboard URL and heading appear |
| LOGIN-02 | Empty credentials are validated | Login page | Submit both fields empty | Two required messages appear and login page remains open |
| LOGIN-03 | Incorrect password is rejected | Login page; configured username exists | Enter configured username and wrong password; submit | Invalid-credentials message appears |
| LOGIN-04 | Forgot-password navigation | Login page | Open Forgot your password? | Reset Password page and username field appear |
| LOGIN-05 | OrangeHRM logo is visible and loaded | Login page | Open login | OrangeHRM logo image is visible and loaded |
| LOGIN-06 | Login label is displayed | Login page | Open login | Login heading is visible |
| LOGIN-07 | Copyright text and company link are displayed | Login page | Open login | Product version, copyright years, company link, and rights-reserved text are visible |
| LOGIN-08 | Social media links are displayed | Login page | Open login | LinkedIn, Facebook, Twitter, and YouTube links are visible with expected destinations |
| DASH-01 | Dashboard widgets render | Authenticated admin session | Open Dashboard | Dashboard heading and Time at Work, My Actions, Quick Launch widgets are visible |
| DASH-02 | Module navigation | Authenticated admin session | Navigate to Admin, PIM, then Leave using side navigation | Each module's route/page loads |
| ADMIN-01 | System user page opens | Authenticated admin session | Open Admin | System Users heading and Add button appear |
| ADMIN-02 | Search an unknown username | Authenticated admin session | Search for a generated, unlikely username | No Records Found appears |
| ADMIN-03 | Blank Add User form validation | Authenticated admin session | Open Add and submit without values | Required-field validation appears |
| PIM-01 | Employee list opens | Authenticated admin session | Open PIM | Employee Information and Search control appear |
| PIM-02 | Blank employee form validation | Authenticated admin session | Open Add Employee and submit blank form | Required-field validation appears |
| PIM-03 | Create, find, and remove an employee | Authenticated admin session | Create a uniquely named employee with a generated ID; search by ID; verify row; remove it in cleanup | The test-owned employee is found and removed |
| LEAVE-01 | Blank leave application validation | Authenticated admin session | Open Leave > Apply Leave; submit blank form | Required-field validation appears |
| LEAVE-02 | Employee created in PIM appears in Leave | Authenticated admin session | Create unique employee in PIM; open Assign Leave; select employee; delete employee in cleanup | Created employee is selectable for assignment; record is removed afterward |

## Adding a page or test

1. Add a page object in `src/pages/` extending `BasePage`; keep interaction
   methods and locators there.
2. Register the object on the `app` fixture in `src/fixtures/test.js`.
3. Add a spec under `src/tests/` and use the shared `test` and `expect`.
4. Assign stable IDs, generate test-owned data, and remove created records in a
   `finally` block. Prefer accessible roles and labels, and Playwright's
   auto-waiting/assertions rather than fixed sleeps.

## Notes and residual risks

- Login specs explicitly use an empty storage state; other specs reuse the
  session established by global setup. Test cases do not depend on execution
  order.
- Employee IDs are generated uniquely for each test, and cleanup verifies both
  employee ID and generated name before deletion to avoid removing another
  user's record. A network interruption during save can still leave an
  untracked record; unique QA-prefixed names help identify it.
- The public demo is shared and may be slow, unavailable, or modified by other
  users. UI labels and validation may change.
- Leave assignment is tested by selecting an employee but not submitting a
  leave request because leave policy and balance are mutable demo data.
- Admin permission behavior for non-admin roles is not asserted: the supplied
  demo credentials provide an administrator account, not a separate limited
  role. Add credentials for a permitted non-admin account to test role access.

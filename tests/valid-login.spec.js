const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('accepts valid credentials and honors the remember-me preference', async ({ page }) => {
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  if (!username || !password) {
    throw new Error('Set SF_USERNAME and SF_PASSWORD environment variables to run the valid login test.');
  }

  const loginPage = new LoginPage(page);

  try {
    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.setRememberMe(true);
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
    await loginPage.submitCredentials(username, password);
    await loginPage.waitForLoginFormToClose();
    await expect(loginPage.loginError).toBeHidden();
  } catch (error) {
    throw new Error('Valid Salesforce login test failed.', { cause: error });
  }
});

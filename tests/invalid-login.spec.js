const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const invalidCredentials = [
  {
    scenario: 'unknown username',
    username: 'invalid.qa.user@example.invalid',
    password: 'InvalidPassword!123'
  },
  {
    scenario: 'invalid password',
    username: 'invalid.qa.user2@example.invalid',
    password: 'WrongPassword!456'
  }
];

for (const credentials of invalidCredentials) {
  test(`rejects invalid credentials (${credentials.scenario})`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    try {
      await loginPage.open();
      await loginPage.submitCredentials(credentials.username, credentials.password);
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).not.toHaveText('');
      await expect(loginPage.usernameInput).toBeVisible();
    } catch (error) {
      throw new Error('Invalid Salesforce login test failed.', { cause: error });
    }
  });
}

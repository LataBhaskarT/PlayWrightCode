class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("xpath=//input[@id='username']");
    this.passwordInput = page.locator("xpath=//input[@id='password']");
    this.loginButton = page.locator("xpath=//input[@id='Login']");
    this.rememberMeCheckbox = page.locator("xpath=//input[@id='rememberUn']");
    this.loginError = page.locator("xpath=//div[@id='error']");
  }

  async open() {
    return this.runAction('open the Salesforce login page', async () => {
      await this.page.goto(
        process.env.SF_LOGIN_URL || 'https://login.salesforce.com/?locale=in',
        {
        waitUntil: 'domcontentloaded'
        }
      );
      await this.usernameInput.waitFor({ state: 'visible' });
      await this.passwordInput.waitFor({ state: 'visible' });
      await this.loginButton.waitFor({ state: 'visible' });
    });
  }

  async setRememberMe(selected) {
    return this.runAction('set the remember-me preference', async () => {
      const currentSelection = await this.rememberMeCheckbox.isChecked();
      if (currentSelection !== selected) {
        if (selected) {
          await this.rememberMeCheckbox.check();
        } else {
          await this.rememberMeCheckbox.uncheck();
        }
      }
    });
  }

  async isRememberMeSelected() {
    return this.runAction('read the remember-me preference', async () =>
      this.rememberMeCheckbox.isChecked()
    );
  }

  async submitCredentials(username, password) {
    return this.runAction('submit the login form', async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }

  async getLoginError() {
    return this.runAction('read the login error', async () => {
      await this.loginError.waitFor({ state: 'visible' });
      return (await this.loginError.innerText()).trim();
    });
  }

  async waitForLoginFormToClose() {
    return this.runAction('wait for the login form to close', async () => {
      await this.usernameInput.waitFor({ state: 'hidden' });
    });
  }

  async runAction(action, operation) {
    try {
      return await operation();
    } catch (error) {
      throw new Error(`Failed to ${action}: ${error.message}`, { cause: error });
    }
  }
}

module.exports = { LoginPage };

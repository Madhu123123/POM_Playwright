import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Handles Login and Signup entry on AutomationExercise.
 * URL: https://automationexercise.com/login
 */
export class LoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Navigation ─────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.navigate('/login');
    }

    // ─── Login Section ───────────────────────────────────────────────────────────

    async enterLoginEmail(email: string): Promise<void> {
        await this.fillByPlaceholder('Email Address', email);
    }

    async enterLoginPassword(password: string): Promise<void> {
        await this.fillByPlaceholder('Password', password);
    }

    async clickLoginButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.enterLoginEmail(email);
        await this.enterLoginPassword(password);
        await this.clickLoginButton();
    }

    // ─── Signup Section ──────────────────────────────────────────────────────────

    async enterSignupName(name: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
    }

    async enterSignupEmail(email: string): Promise<void> {
        // The signup email is the second email field on the page
        await this.page.locator('input[data-qa="signup-email"]').fill(email);
    }

    async clickSignupButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Signup' }).click();
    }

    async startSignup(name: string, email: string): Promise<void> {
        await this.enterSignupName(name);
        await this.enterSignupEmail(email);
        await this.clickSignupButton();
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async isLoginPageLoaded(): Promise<boolean> {
        return this.page.getByText('Login to your account').isVisible();
    }

    async isLoginErrorVisible(): Promise<boolean> {
        return this.page.getByText('Your email or password is incorrect!').isVisible();
    }

    async getLoginErrorMessage(): Promise<string> {
        const element = this.page.getByText('Your email or password is incorrect!');
        return (await element.textContent()) || '';
    }

    async verifyLoginHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    }

    async verifySignupHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
    }

    async isAlreadyRegisteredErrorVisible(): Promise<boolean> {
        return this.page.getByText('Email Address already exist!').isVisible();
    }
}

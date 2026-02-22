import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserRegistrationData } from '../types/TestData.types';

/**
 * SignupPage - Handles user account registration form.
 * URL: https://automationexercise.com/signup
 */
export class SignupPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Title Selection ─────────────────────────────────────────────────────────

    async selectTitle(title: 'Mr.' | 'Mrs.'): Promise<void> {
        if (title === 'Mr.') {
            await this.page.getByRole('radio', { name: 'Mr.' }).check();
        } else {
            await this.page.getByRole('radio', { name: 'Mrs.' }).check();
        }
    }

    // ─── Personal Info ───────────────────────────────────────────────────────────

    async enterPassword(password: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Password *' }).fill(password);
    }

    async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
        await this.page.locator('select[data-qa="days"]').selectOption(day);
        await this.page.locator('select[data-qa="months"]').selectOption(month);
        await this.page.locator('select[data-qa="years"]').selectOption(year);
    }

    async checkNewsletterOptIn(): Promise<void> {
        await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    }

    async checkSpecialOffersOptIn(): Promise<void> {
        await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
    }

    // ─── Address Info ────────────────────────────────────────────────────────────

    async enterFirstName(firstName: string): Promise<void> {
        await this.page.locator('input[data-qa="first_name"]').fill(firstName);
    }

    async enterLastName(lastName: string): Promise<void> {
        await this.page.locator('input[data-qa="last_name"]').fill(lastName);
    }

    async enterCompany(company: string): Promise<void> {
        await this.page.locator('input[data-qa="company"]').fill(company);
    }

    async enterAddress1(address: string): Promise<void> {
        await this.page.locator('input[data-qa="address"]').fill(address);
    }

    async enterAddress2(address: string): Promise<void> {
        await this.page.locator('input[data-qa="address2"]').fill(address);
    }

    async selectCountry(country: string): Promise<void> {
        await this.page.locator('select[data-qa="country"]').selectOption(country);
    }

    async enterState(state: string): Promise<void> {
        await this.page.locator('input[data-qa="state"]').fill(state);
    }

    async enterCity(city: string): Promise<void> {
        await this.page.locator('input[data-qa="city"]').fill(city);
    }

    async enterZipcode(zipcode: string): Promise<void> {
        await this.page.locator('input[data-qa="zipcode"]').fill(zipcode);
    }

    async enterMobileNumber(mobile: string): Promise<void> {
        await this.page.locator('input[data-qa="mobile_number"]').fill(mobile);
    }

    // ─── Submit ──────────────────────────────────────────────────────────────────

    async clickCreateAccount(): Promise<void> {
        await this.page.getByRole('button', { name: 'Create Account' }).click();
    }

    async clickContinue(): Promise<void> {
        await this.page.getByRole('link', { name: 'Continue' }).click();
    }

    // ─── Complete Registration ───────────────────────────────────────────────────

    async fillRegistrationForm(data: UserRegistrationData): Promise<void> {
        await this.selectTitle(data.title);
        await this.enterPassword(data.password);
        await this.selectDateOfBirth(data.dateOfBirth, data.monthOfBirth, data.yearOfBirth);
        await this.checkNewsletterOptIn();
        await this.checkSpecialOffersOptIn();
        await this.enterFirstName(data.firstName_address);
        await this.enterLastName(data.lastName_address);
        await this.enterCompany(data.company);
        await this.enterAddress1(data.address1);
        await this.enterAddress2(data.address2);
        await this.selectCountry(data.country);
        await this.enterState(data.state);
        await this.enterCity(data.city);
        await this.enterZipcode(data.zipcode);
        await this.enterMobileNumber(data.mobileNumber);
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async isAccountCreatedVisible(): Promise<boolean> {
        return this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' }).isVisible();
    }

    async verifyAccountCreated(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'ACCOUNT CREATED!' })).toBeVisible();
    }

    async verifyEnterAccountInfoHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();
    }
}

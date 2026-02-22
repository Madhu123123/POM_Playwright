import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage - Handles all interactions on the AutomationExercise home page.
 * URL: https://automationexercise.com/
 */
export class HomePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Navigation ─────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.navigate('/');
    }

    // ─── Header Navigation Links ─────────────────────────────────────────────────

    async clickHomeLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Home' });
    }

    async clickProductsLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Products' });
    }

    async clickCartLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Cart' });
    }

    async clickLoginLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Signup / Login' });
    }

    async clickContactUsLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Contact us' });
    }

    async clickTestCasesLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Test Cases' });
    }

    async clickLogoutLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Logout' });
    }

    async clickDeleteAccountLink(): Promise<void> {
        await this.clickByRole('link', { name: ' Delete Account' });
    }

    // ─── Page Verification ───────────────────────────────────────────────────────

    async isHomePageLoaded(): Promise<boolean> {
        return this.isRoleVisible('link', { name: ' Home' });
    }

    async isUserLoggedIn(username: string): Promise<boolean> {
        return this.page.getByText(`Logged in as ${username}`).isVisible();
    }

    async getLoggedInUsername(): Promise<string> {
        const text = await this.page.getByText(/Logged in as/i).textContent();
        return text?.replace('Logged in as', '').trim() || '';
    }

    async verifyHomePageTitle(): Promise<void> {
        await this.assertTextVisible('AutomationExercise');
    }

    async verifyAllCategoriesVisible(): Promise<void> {
        await this.assertRoleVisible('heading', { name: 'Category' });
    }

    async verifyFeaturedItemsVisible(): Promise<void> {
        await this.assertTextVisible('Features Items');
    }

    // ─── Subscription (Footer) ───────────────────────────────────────────────────

    async subscribeWithEmail(email: string): Promise<void> {
        await this.scrollToBottom();
        await this.assertRoleVisible('heading', { name: 'Subscription' });
        await this.fillByPlaceholder('Your email address', email);
        await this.page.getByRole('button', { name: '' }).click(); // Subscribe arrow button
    }

    async isSubscriptionSuccessVisible(): Promise<boolean> {
        return this.page.getByText('You have been successfully subscribed!').isVisible();
    }

    // ─── Category Navigation ─────────────────────────────────────────────────────

    async clickWomenCategory(): Promise<void> {
        await this.clickByRole('link', { name: 'Women' });
    }

    async clickMenCategory(): Promise<void> {
        await this.clickByRole('link', { name: 'Men' });
    }

    async clickKidsCategory(): Promise<void> {
        await this.clickByRole('link', { name: 'Kids' });
    }

    // ─── Scroll Functionality ────────────────────────────────────────────────────

    async scrollToSubscription(): Promise<void> {
        await this.scrollToBottom();
        await this.assertTextVisible('SUBSCRIPTION');
    }

    async scrollToTopAndVerify(): Promise<void> {
        await this.scrollToBottom();
        await this.page.getByRole('link', { name: '' }).click(); // scroll-up btn
        await this.assertTextVisible('Full-Fledged practice website for Automation Engineers');
    }
}

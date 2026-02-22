import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage - Handles checkout address and order review.
 * URL: https://automationexercise.com/checkout
 */
export class CheckoutPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Address Verification ────────────────────────────────────────────────────

    async verifyDeliveryAddressName(name: string): Promise<void> {
        await expect(this.page.locator('#address_delivery').getByText(name)).toBeVisible();
    }

    async verifyBillingAddressName(name: string): Promise<void> {
        await expect(this.page.locator('#address_invoice').getByText(name)).toBeVisible();
    }

    // ─── Order Comment ────────────────────────────────────────────────────────────

    async enterOrderComment(comment: string): Promise<void> {
        await this.page.locator('textarea[name="message"]').fill(comment);
    }

    // ─── Navigation ──────────────────────────────────────────────────────────────

    async clickPlaceOrder(): Promise<void> {
        await this.page.getByRole('link', { name: 'Place Order' }).click();
    }

    // ─── Product Verification ────────────────────────────────────────────────────

    async verifyProductInOrderSummary(productName: string): Promise<void> {
        await expect(this.page.locator('#cart_info').getByText(productName)).toBeVisible();
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyCheckoutPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    }

    async verifyAddressDetailsHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    }

    async verifyOrderReviewHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
    }
}

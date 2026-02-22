import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentData } from '../types/TestData.types';

/**
 * PaymentPage - Handles payment form on checkout.
 * URL: https://automationexercise.com/payment
 */
export class PaymentPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Payment Form ────────────────────────────────────────────────────────────

    async enterCardName(name: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Name on Card' }).fill(name);
    }

    async enterCardNumber(number: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Card Number' }).fill(number);
    }

    async enterCVC(cvc: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'ex.' }).fill(cvc);
    }

    async enterExpiryMonth(month: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'MM' }).fill(month);
    }

    async enterExpiryYear(year: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'YYYY' }).fill(year);
    }

    async fillPaymentForm(data: PaymentData): Promise<void> {
        await this.enterCardName(data.cardName);
        await this.enterCardNumber(data.cardNumber);
        await this.enterCVC(data.cvc);
        await this.enterExpiryMonth(data.expiryMonth);
        await this.enterExpiryYear(data.expiryYear);
    }

    async clickPayAndConfirmOrder(): Promise<void> {
        await this.page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyPaymentPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    }

    async verifyOrderPlaced(): Promise<void> {
        await expect(
            this.page.getByText('Congratulations! Your order has been confirmed!')
        ).toBeVisible({ timeout: 20000 });
    }

    async isOrderConfirmed(): Promise<boolean> {
        return this.page.getByText('Your order has been confirmed!').isVisible();
    }
}

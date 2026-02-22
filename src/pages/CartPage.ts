import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Handles the shopping cart page.
 * URL: https://automationexercise.com/view_cart
 */
export class CartPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Navigation ─────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.navigate('/view_cart');
    }

    // ─── Cart Actions ────────────────────────────────────────────────────────────

    async clickProceedToCheckout(): Promise<void> {
        await this.page.getByRole('link', { name: 'Proceed To Checkout' }).click();
    }

    async clickRegisterLoginInModal(): Promise<void> {
        await this.page.getByRole('link', { name: 'Register / Login' }).click();
    }

    async removeProductFromCart(productName: string): Promise<void> {
        const row = this.page.locator('tr').filter({ hasText: productName });
        await row.getByRole('link', { name: '' }).click(); // 'X' delete button
    }

    async updateQuantity(productName: string, quantity: string): Promise<void> {
        const row = this.page.locator('tr').filter({ hasText: productName });
        await row.locator('.cart_quantity_input').fill(quantity);
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyCartPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    }

    async verifyProductInCart(productName: string): Promise<void> {
        await expect(this.page.locator('.cart_description').getByText(productName)).toBeVisible();
    }

    async isCartEmpty(): Promise<boolean> {
        const rows = this.page.locator('#cart_info_table tbody tr');
        return (await rows.count()) === 0;
    }

    async getCartItemCount(): Promise<number> {
        return this.page.locator('#cart_info_table tbody tr').count();
    }

    async verifyProductQuantity(productName: string, expectedQty: string): Promise<void> {
        const row = this.page.locator('tr').filter({ hasText: productName });
        await expect(row.locator('.cart_quantity button')).toHaveText(expectedQty);
    }
}

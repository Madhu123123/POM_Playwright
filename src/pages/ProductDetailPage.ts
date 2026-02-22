import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage - Handles product detail view.
 * URL: https://automationexercise.com/product_details/:id
 */
export class ProductDetailPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Product Info ────────────────────────────────────────────────────────────

    async getProductName(): Promise<string> {
        return (await this.page.locator('.product-information h2').textContent()) || '';
    }

    async getProductPrice(): Promise<string> {
        return (await this.page.locator('.product-information span span').textContent()) || '';
    }

    async getProductCategory(): Promise<string> {
        const text = await this.page.getByText(/Category:/).textContent();
        return text?.replace('Category:', '').trim() || '';
    }

    // ─── Quantity & Cart ─────────────────────────────────────────────────────────

    async setQuantity(quantity: number): Promise<void> {
        await this.page.locator('#quantity').clear();
        await this.page.locator('#quantity').fill(String(quantity));
    }

    async clickAddToCart(): Promise<void> {
        await this.page.getByRole('button', { name: 'Add to cart' }).click();
    }

    async clickViewCart(): Promise<void> {
        await this.page.getByRole('link', { name: 'View Cart' }).click();
    }

    async clickContinueShopping(): Promise<void> {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
    }

    // ─── Write Review ────────────────────────────────────────────────────────────

    async writeReview(name: string, email: string, review: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Your Name' }).fill(name);
        await this.page.getByRole('textbox', { name: 'Email Address' }).fill(email);
        await this.page.locator('#review').fill(review);
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyProductDetailPageLoaded(): Promise<void> {
        await expect(this.page.locator('.product-information')).toBeVisible();
    }

    async verifyProductNameVisible(productName: string): Promise<void> {
        await expect(this.page.locator('.product-information h2')).toContainText(productName);
    }

    async verifyProductAddedModal(): Promise<void> {
        await expect(
            this.page.getByRole('heading', { name: 'Added!' })
        ).toBeVisible({ timeout: 10000 });
    }

    async verifyReviewSubmitted(): Promise<void> {
        await expect(this.page.getByText('Thank you for your review.')).toBeVisible();
    }
}

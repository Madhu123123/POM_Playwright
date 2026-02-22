import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage - Handles product listing and search functionality.
 * URL: https://automationexercise.com/products
 */
export class ProductsPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Navigation ─────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.navigate('/products');
    }

    // ─── Search ──────────────────────────────────────────────────────────────────

    async searchProduct(productName: string): Promise<void> {
        await this.fillByPlaceholder('Search Product', productName);
        await this.page.getByRole('button', { name: '' }).click(); // magnifier/search btn
    }

    async performSearch(searchTerm: string): Promise<void> {
        await this.fillByPlaceholder('Search Product', searchTerm);
        await this.page.locator('button#submit_search').click();
    }

    // ─── Product Interactions ────────────────────────────────────────────────────

    async hoverAndAddFirstProductToCart(): Promise<void> {
        const firstProduct = this.page.locator('.product-image-wrapper').first();
        await firstProduct.hover();
        await firstProduct.getByRole('link', { name: 'Add to cart' }).click();
    }

    async clickViewProductByIndex(index = 0): Promise<void> {
        await this.page.getByRole('link', { name: 'View Product' }).nth(index).click();
    }

    async clickViewProductByName(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: `View Product` })
            .filter({ has: this.page.getByText(productName) })
            .first()
            .click();
    }

    async addProductToCartByName(productName: string): Promise<void> {
        const productCard = this.page.locator('.productinfo').filter({ hasText: productName });
        await productCard.hover();
        await productCard.getByRole('link', { name: 'Add to cart' }).click();
    }

    // ─── Modal Handling ──────────────────────────────────────────────────────────

    async clickContinueShoppingInModal(): Promise<void> {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
    }

    async clickViewCartInModal(): Promise<void> {
        await this.page.getByRole('link', { name: 'View Cart' }).click();
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyProductsPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    }

    async verifySearchResultsHeading(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    }

    async verifySearchResultsContain(productName: string): Promise<void> {
        const products = this.page.locator('.productinfo p');
        const count = await products.count();
        let found = false;
        for (let i = 0; i < count; i++) {
            const text = await products.nth(i).textContent();
            if (text?.toLowerCase().includes(productName.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found, `Expected to find product containing "${productName}" in search results`).toBeTruthy();
    }

    async getProductCount(): Promise<number> {
        return this.page.locator('.product-image-wrapper').count();
    }
}

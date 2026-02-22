import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC006 - Add Product to Cart', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC006');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC006 - Add product to cart and verify cart', async ({
        page, homePage, productsPage, productDetailPage, cartPage
    }) => {
        await allure.feature('Shopping Cart');
        await allure.story('Add to Cart');
        await allure.severity('critical');
        await allure.description('Navigates to products, views a product detail, and adds it to the cart. Verifies cart contains the product.');

        const productData = TestDataHelper.getProductData();
        await allure.parameter('Product', productData.productName);
        await allure.parameter('Quantity', String(productData.quantity));

        await test.step('Navigate to Products page', async () => {
            await homePage.goto();
            await homePage.clickProductsLink();
            await productsPage.verifyProductsPageLoaded();
        });

        await test.step('Click View Product for first product', async () => {
            await productsPage.clickViewProductByIndex(0);
            await productDetailPage.verifyProductDetailPageLoaded();
            await ScreenshotHelper.captureAndAttach(page, 'TC006_Product_Detail');
        });

        await test.step('Set quantity and add to cart', async () => {
            await productDetailPage.setQuantity(productData.quantity);
            await productDetailPage.clickAddToCart();
            await ScreenshotHelper.captureAndAttach(page, 'TC006_Product_Added_Modal');
        });

        await test.step('Navigate to Cart', async () => {
            await productDetailPage.clickViewCart();
            await cartPage.verifyCartPageLoaded();
        });

        await test.step('Verify cart has at least one item', async () => {
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount, 'Cart should have at least 1 item after adding product').toBeGreaterThan(0);
            await ScreenshotHelper.captureAndAttach(page, 'TC006_Cart_Verified');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC006');
    });
});

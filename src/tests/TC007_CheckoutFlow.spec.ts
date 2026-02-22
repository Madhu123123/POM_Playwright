import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC007 - Checkout Flow', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC007');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC007 - Complete checkout with logged in user', async ({
        page, homePage, loginPage, productsPage, productDetailPage, cartPage, checkoutPage, paymentPage
    }) => {
        await allure.feature('Checkout');
        await allure.story('End-to-End Checkout');
        await allure.severity('critical');
        await allure.description('Logs in, adds a product to cart, proceeds through checkout, and confirms payment.');

        const loginData = TestDataHelper.getValidLoginData();
        const paymentData = TestDataHelper.getPaymentData();

        await test.step('Login with valid credentials', async () => {
            await homePage.goto();
            await homePage.clickLoginLink();
            await loginPage.login(loginData.email, loginData.password);
            await ScreenshotHelper.captureAndAttach(page, 'TC007_Logged_In');
        });

        await test.step('Add a product to cart', async () => {
            await homePage.clickProductsLink();
            await productsPage.verifyProductsPageLoaded();
            await productsPage.clickViewProductByIndex(0);
            await productDetailPage.setQuantity(1);
            await productDetailPage.clickAddToCart();
            await productDetailPage.clickViewCart();
        });

        await test.step('Proceed to Checkout', async () => {
            await cartPage.verifyCartPageLoaded();
            await cartPage.clickProceedToCheckout();
            await ScreenshotHelper.captureAndAttach(page, 'TC007_Checkout_Page');
        });

        await test.step('Review order and place order', async () => {
            await checkoutPage.verifyAddressDetailsHeading();
            await checkoutPage.verifyOrderReviewHeading();
            await checkoutPage.enterOrderComment('Automated test order - please discard');
            await checkoutPage.clickPlaceOrder();
            await ScreenshotHelper.captureAndAttach(page, 'TC007_Payment_Page');
        });

        await test.step('Enter payment details and confirm', async () => {
            await paymentPage.verifyPaymentPageLoaded();
            await paymentPage.fillPaymentForm(paymentData);
            await paymentPage.clickPayAndConfirmOrder();
            await ScreenshotHelper.captureAndAttach(page, 'TC007_Order_Placed');
        });

        await test.step('Verify order confirmation', async () => {
            await paymentPage.verifyOrderPlaced();
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC007');
    });
});

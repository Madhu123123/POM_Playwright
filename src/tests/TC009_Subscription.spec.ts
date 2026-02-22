import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC009 - Email Subscription', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC009');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC009 - Subscribe to newsletter via footer', async ({
        page, homePage
    }) => {
        await allure.feature('Subscription');
        await allure.story('Newsletter Signup');
        await allure.severity('minor');
        await allure.description('Scrolls to footer, enters email, and subscribes to newsletter. Verifies success message.');

        const subscriptionData = TestDataHelper.getSubscriptionData();
        await allure.parameter('Email', subscriptionData.email);

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        await test.step('Scroll to footer and find subscription section', async () => {
            await homePage.scrollToBottom();
            await homePage.assertTextVisible('SUBSCRIPTION');
            await ScreenshotHelper.captureAndAttach(page, 'TC009_Subscription_Section');
        });

        await test.step('Enter email and subscribe', async () => {
            await homePage.subscribeWithEmail(subscriptionData.email);
        });

        await test.step('Verify subscription success message', async () => {
            const isSuccess = await homePage.isSubscriptionSuccessVisible();
            expect(isSuccess, 'Subscription success message should be visible').toBeTruthy();
            await ScreenshotHelper.captureAndAttach(page, 'TC009_Subscription_Success');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC009');
    });
});

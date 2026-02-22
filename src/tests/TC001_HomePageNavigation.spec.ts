import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC001 - Home Page Navigation', () => {

    test.beforeEach(async ({ homePage }) => {
        // Excel Control: Check if this test should run
        const shouldRun = await ExcelHelper.shouldRun('TC001');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC001 - Verify Home Page Loads and Core Elements are Visible', async ({ page, homePage }) => {
        await allure.feature('Home Page');
        await allure.story('Navigation');
        await allure.severity('critical');
        await allure.description('Verifies home page loads correctly with all navigation links, featured products, and categories.');

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
            await ScreenshotHelper.captureAndAttach(page, 'TC001_Home_Loaded');
        });

        await test.step('Verify Home page title', async () => {
            await homePage.assertTitleContains('Automation Exercise');
        });

        await test.step('Verify navigation links are visible', async () => {
            await homePage.assertRoleVisible('link', { name: ' Home' });
            await homePage.assertRoleVisible('link', { name: ' Products' });
            await homePage.assertRoleVisible('link', { name: ' Cart' });
            await homePage.assertRoleVisible('link', { name: ' Signup / Login' });
        });

        await test.step('Verify Featured Items section', async () => {
            await homePage.verifyFeaturedItemsVisible();
            await ScreenshotHelper.captureAndAttach(page, 'TC001_Featured_Items');
        });

        await test.step('Verify Categories sidebar is visible', async () => {
            await homePage.verifyAllCategoriesVisible();
        });

        await test.step('Verify URL is correct', async () => {
            await homePage.assertURLContains('automationexercise.com');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC001');
    });
});

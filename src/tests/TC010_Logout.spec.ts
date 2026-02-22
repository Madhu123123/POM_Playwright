import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC010 - Logout Flow', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC010');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC010 - Login and then Logout successfully', async ({
        page, homePage, loginPage
    }) => {
        await allure.feature('User Account');
        await allure.story('Logout');
        await allure.severity('normal');
        await allure.description('Logs in with valid credentials, then logs out and verifies the user is redirected to login page.');

        const loginData = TestDataHelper.getValidLoginData();
        await allure.parameter('Email', loginData.email);

        await test.step('Navigate to Login page', async () => {
            await homePage.goto();
            await homePage.clickLoginLink();
            await loginPage.verifyLoginHeading();
        });

        await test.step('Login with valid credentials', async () => {
            await loginPage.login(loginData.email, loginData.password);
            await ScreenshotHelper.captureAndAttach(page, 'TC010_Logged_In');
        });

        await test.step('Verify user is logged in', async () => {
            await homePage.assertRoleVisible('link', { name: ' Logout' });
        });

        await test.step('Click Logout link', async () => {
            await homePage.clickLogoutLink();
            await ScreenshotHelper.captureAndAttach(page, 'TC010_After_Logout');
        });

        await test.step('Verify user is redirected to login page', async () => {
            await loginPage.verifyLoginHeading();
            await homePage.assertURLContains('login');
        });

        await test.step('Verify Logout link is no longer visible', async () => {
            const isLogoutVisible = await homePage.isRoleVisible('link', { name: ' Logout' });
            expect(isLogoutVisible, 'Logout link should not be visible after logging out').toBeFalsy();
            await ScreenshotHelper.captureAndAttach(page, 'TC010_Session_Cleared');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC010');
    });
});

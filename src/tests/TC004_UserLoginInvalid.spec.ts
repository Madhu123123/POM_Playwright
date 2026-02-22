import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC004 - User Login (Invalid Credentials)', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC004');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC004 - Login with invalid credentials shows error', async ({
        page, homePage, loginPage
    }) => {
        await allure.feature('User Account');
        await allure.story('Login Validation');
        await allure.severity('normal');
        await allure.description('Verifies that an appropriate error message is shown when invalid credentials are used.');

        const loginData = TestDataHelper.getInvalidLoginData();
        await allure.parameter('Email', loginData.email);
        await allure.parameter('Expected Result', loginData.expectedResult);

        await test.step('Navigate to Login page', async () => {
            await homePage.goto();
            await homePage.clickLoginLink();
        });

        await test.step('Enter invalid credentials', async () => {
            await loginPage.login(loginData.email, loginData.password);
            await ScreenshotHelper.captureAndAttach(page, 'TC004_After_Login_Attempt');
        });

        await test.step('Verify error message is displayed', async () => {
            const isErrorVisible = await loginPage.isLoginErrorVisible();
            expect(isErrorVisible, 'Login error message should be visible for invalid credentials').toBeTruthy();
            await ScreenshotHelper.captureAndAttach(page, 'TC004_Error_Message');
        });

        await test.step('Verify user is NOT redirected', async () => {
            await loginPage.assertURLContains('login');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC004');
    });
});

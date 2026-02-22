import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC003 - User Login (Valid Credentials)', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC003');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC003 - Login with valid email and password', async ({
        page, homePage, loginPage
    }) => {
        await allure.feature('User Account');
        await allure.story('Login');
        await allure.severity('critical');
        await allure.description('Verifies that a user can log in successfully with valid credentials.');

        const loginData = TestDataHelper.getValidLoginData();
        await allure.parameter('Email', loginData.email);

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        await test.step('Click Signup / Login link', async () => {
            await homePage.clickLoginLink();
        });

        await test.step('Verify Login page is displayed', async () => {
            await loginPage.verifyLoginHeading();
            await ScreenshotHelper.captureAndAttach(page, 'TC003_Login_Page');
        });

        await test.step('Enter valid login credentials', async () => {
            await loginPage.login(loginData.email, loginData.password);
        });

        await test.step('Verify user is logged in', async () => {
            await homePage.assertURLContains('automationexercise.com');
            await homePage.assertRoleVisible('link', { name: ' Logout' });
            await ScreenshotHelper.captureAndAttach(page, 'TC003_Logged_In');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC003');
    });
});

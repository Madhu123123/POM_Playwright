import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC002 - User Registration', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC002');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC002 - Register new user with valid details', async ({
        page, homePage, loginPage, signupPage
    }) => {
        await allure.feature('User Account');
        await allure.story('Registration');
        await allure.severity('critical');
        await allure.description('Registers a new user account with dynamically generated data using Faker.');

        const userData = TestDataHelper.generateUserData();
        await allure.parameter('Email', userData.email);
        await allure.parameter('Name', `${userData.firstName} ${userData.lastName}`);

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        await test.step('Click Signup / Login link', async () => {
            await homePage.clickLoginLink();
            await loginPage.verifySignupHeading();
        });

        await test.step('Enter signup name and email', async () => {
            await loginPage.startSignup(`${userData.firstName} ${userData.lastName}`, userData.email);
            await ScreenshotHelper.captureAndAttach(page, 'TC002_Signup_Form');
        });

        await test.step('Verify Enter Account Information page', async () => {
            await signupPage.verifyEnterAccountInfoHeading();
        });

        await test.step('Fill registration form', async () => {
            await signupPage.fillRegistrationForm(userData);
            await ScreenshotHelper.captureAndAttach(page, 'TC002_Registration_Filled');
        });

        await test.step('Click Create Account button', async () => {
            await signupPage.clickCreateAccount();
        });

        await test.step('Verify account created successfully', async () => {
            await signupPage.verifyAccountCreated();
            await ScreenshotHelper.captureAndAttach(page, 'TC002_Account_Created');
        });

        await test.step('Continue and verify logged in', async () => {
            await signupPage.clickContinue();
            await homePage.assertURLContains('automationexercise.com');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC002');
    });
});

import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC008 - Contact Us Form', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC008');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC008 - Submit Contact Us form successfully', async ({
        page, homePage, contactUsPage
    }) => {
        await allure.feature('Contact');
        await allure.story('Contact Form Submission');
        await allure.severity('normal');
        await allure.description('Fills out and submits the Contact Us form. Verifies success message appears after submission.');

        const contactData = TestDataHelper.getContactFormData();
        await allure.parameter('Name', contactData.name);
        await allure.parameter('Subject', contactData.subject);

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        await test.step('Click Contact Us link', async () => {
            await homePage.clickContactUsLink();
            await contactUsPage.verifyContactPageLoaded();
            await ScreenshotHelper.captureAndAttach(page, 'TC008_Contact_Page');
        });

        await test.step('Fill Contact Us form', async () => {
            await contactUsPage.fillContactForm(contactData);
            await ScreenshotHelper.captureAndAttach(page, 'TC008_Form_Filled');
        });

        await test.step('Submit the form and accept dialog', async () => {
            page.once('dialog', (dialog) => dialog.accept());
            await contactUsPage.submitForm();
        });

        await test.step('Verify success message', async () => {
            await contactUsPage.verifySuccessMessage();
            await ScreenshotHelper.captureAndAttach(page, 'TC008_Success_Message');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC008');
    });
});

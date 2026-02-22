import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';
import { ExcelHelper } from '../utils/ExcelHelper';
import { TestDataHelper } from '../utils/TestDataHelper';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

test.describe('TC005 - Product Search', () => {

    test.beforeEach(async () => {
        const shouldRun = await ExcelHelper.shouldRun('TC005');
        if (!shouldRun) {
            test.skip();
        }
    });

    test('TC005 - Search for a product and verify results', async ({
        page, homePage, productsPage
    }) => {
        await allure.feature('Product Catalog');
        await allure.story('Search');
        await allure.severity('normal');
        await allure.description('Searches for a product by keyword and verifies that search results are displayed correctly.');

        const searchData = TestDataHelper.getProductSearchData();
        await allure.parameter('Search Term', searchData.searchTerm);

        await test.step('Navigate to Home Page', async () => {
            await homePage.goto();
        });

        await test.step('Navigate to Products page', async () => {
            await homePage.clickProductsLink();
            await productsPage.verifyProductsPageLoaded();
            await ScreenshotHelper.captureAndAttach(page, 'TC005_Products_Page');
        });

        await test.step(`Search for "${searchData.searchTerm}"`, async () => {
            await productsPage.performSearch(searchData.searchTerm);
            await ScreenshotHelper.captureAndAttach(page, 'TC005_Search_Performed');
        });

        await test.step('Verify Searched Products heading appears', async () => {
            await productsPage.verifySearchResultsHeading();
        });

        await test.step('Verify at least one search result is shown', async () => {
            const count = await productsPage.getProductCount();
            expect(count, 'Search should return at least one product').toBeGreaterThan(0);
            await ScreenshotHelper.captureAndAttach(page, 'TC005_Search_Results');
        });

        await ScreenshotHelper.captureOnFailure(page, 'TC005');
    });
});

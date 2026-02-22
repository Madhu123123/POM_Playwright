import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : 2,
    timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,

    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        [
            'allure-playwright',
            {
                detail: true,
                outputFolder: 'allure-results',
                suiteTitle: false,
                categories: [
                    {
                        name: 'Ignored tests',
                        matchedStatuses: ['skipped'],
                    },
                    {
                        name: 'Product defects',
                        matchedStatuses: ['failed'],
                    },
                    {
                        name: 'Test defects',
                        matchedStatuses: ['broken'],
                    },
                ],
                environmentInfo: {
                    APP_URL: process.env.BASE_URL || 'https://automationexercise.com',
                    BROWSER: 'Chromium',
                    FRAMEWORK: 'Playwright + TypeScript',
                    REPORTING: 'Allure',
                },
            },
        ],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'https://automationexercise.com',
        headless: process.env.HEADLESS !== 'false',
        slowMo: Number(process.env.SLOW_MO) || 0,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
        actionTimeout: 15000,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    outputDir: 'test-results',
});

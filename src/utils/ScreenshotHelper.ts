import { Page, test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * ScreenshotHelper - Manages screenshot capture and attachment to Allure reports.
 */
export class ScreenshotHelper {
    private static screenshotDir = path.resolve(process.cwd(), 'test-results', 'screenshots');

    /**
     * Ensures screenshot directory exists
     */
    private static ensureDir(): void {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    /**
     * Capture a screenshot and attach it to the Allure report
     */
    static async captureAndAttach(page: Page, name: string): Promise<void> {
        this.ensureDir();
        const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        const filePath = path.join(this.screenshotDir, fileName);

        const buffer = await page.screenshot({ path: filePath, fullPage: true });

        await test.info().attach(name, {
            body: buffer,
            contentType: 'image/png',
        });
    }

    /**
     * Capture a screenshot on test failure (auto-called in after hooks)
     */
    static async captureOnFailure(page: Page, testName: string): Promise<void> {
        const status = test.info().status;
        if (status === 'failed' || status === 'timedOut') {
            await this.captureAndAttach(page, `FAILURE_${testName}`);
        }
    }

    /**
     * Capture full page screenshot
     */
    static async captureFullPage(page: Page, name: string): Promise<Buffer> {
        this.ensureDir();
        const filePath = path.join(this.screenshotDir, `${name}_${Date.now()}.png`);
        const buffer = await page.screenshot({ path: filePath, fullPage: true });
        return buffer;
    }
}

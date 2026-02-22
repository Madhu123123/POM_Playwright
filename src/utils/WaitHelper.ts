import { Page } from '@playwright/test';

/**
 * WaitHelper - Smart wait utilities wrapping Playwright's built-in waits.
 * Centralizes all waiting logic for reuse across page objects.
 */
export class WaitHelper {

    /**
     * Wait for network to be idle (no requests for 500ms)
     */
    static async waitForNetworkIdle(page: Page, timeoutMs = 10000): Promise<void> {
        await page.waitForLoadState('networkidle', { timeout: timeoutMs });
    }

    /**
     * Wait for DOM content to be loaded
     */
    static async waitForDOMLoad(page: Page, timeoutMs = 10000): Promise<void> {
        await page.waitForLoadState('domcontentloaded', { timeout: timeoutMs });
    }

    /**
     * Wait for a URL pattern to match
     */
    static async waitForURL(page: Page, urlPattern: string | RegExp, timeoutMs = 15000): Promise<void> {
        await page.waitForURL(urlPattern, { timeout: timeoutMs });
    }

    /**
     * Wait for an element to be visible using getByRole
     */
    static async waitForRole(
        page: Page,
        role: Parameters<Page['getByRole']>[0],
        options?: Parameters<Page['getByRole']>[1],
        timeoutMs = 10000
    ): Promise<void> {
        await page.getByRole(role, options).waitFor({ state: 'visible', timeout: timeoutMs });
    }

    /**
     * Wait for a specific text to appear in the page
     */
    static async waitForText(page: Page, text: string, timeoutMs = 10000): Promise<void> {
        await page.getByText(text).first().waitFor({ state: 'visible', timeout: timeoutMs });
    }

    /**
     * Wait for page to fully load (combined check)
     */
    static async waitForPageLoad(page: Page): Promise<void> {
        await page.waitForLoadState('load');
        await page.waitForLoadState('domcontentloaded');
    }

    /**
     * Smart wait with retry - tries to find element, retries on failure
     */
    static async waitWithRetry(
        page: Page,
        action: () => Promise<void>,
        maxRetries = 3,
        delayMs = 1000
    ): Promise<void> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await action();
                return;
            } catch (error) {
                if (attempt === maxRetries) throw error;
                console.log(`⟳ Retry attempt ${attempt}/${maxRetries}...`);
                await page.waitForTimeout(delayMs);
            }
        }
    }
}

import { Page, Locator, expect } from '@playwright/test';
import { WaitHelper } from '../utils/WaitHelper';

/**
 * BasePage - Abstract base class for all page objects.
 * Provides shared, reusable Playwright methods using semantic locators.
 */
export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ─── Navigation ────────────────────────────────────────────────────────────

    async navigate(path = '/'): Promise<void> {
        await this.page.goto(path);
        await WaitHelper.waitForPageLoad(this.page);
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async goBack(): Promise<void> {
        await this.page.goBack();
        await WaitHelper.waitForPageLoad(this.page);
    }

    // ─── Clicking ───────────────────────────────────────────────────────────────

    async clickByRole(
        role: Parameters<Page['getByRole']>[0],
        options?: Parameters<Page['getByRole']>[1]
    ): Promise<void> {
        await this.page.getByRole(role, options).click();
    }

    async clickByText(text: string): Promise<void> {
        await this.page.getByText(text).first().click();
    }

    async clickByLabel(label: string): Promise<void> {
        await this.page.getByLabel(label).click();
    }

    async clickByTestId(testId: string): Promise<void> {
        await this.page.getByTestId(testId).click();
    }

    // ─── Filling ────────────────────────────────────────────────────────────────

    async fillByLabel(label: string, value: string): Promise<void> {
        await this.page.getByLabel(label).clear();
        await this.page.getByLabel(label).fill(value);
    }

    async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
        await this.page.getByPlaceholder(placeholder).clear();
        await this.page.getByPlaceholder(placeholder).fill(value);
    }

    async fillByRole(
        role: Parameters<Page['getByRole']>[0],
        options: Parameters<Page['getByRole']>[1],
        value: string
    ): Promise<void> {
        await this.page.getByRole(role, options).clear();
        await this.page.getByRole(role, options).fill(value);
    }

    // ─── Selection ──────────────────────────────────────────────────────────────

    async selectByLabel(label: string, value: string): Promise<void> {
        await this.page.getByLabel(label).selectOption(value);
    }

    async selectByRole(
        role: Parameters<Page['getByRole']>[0],
        options: Parameters<Page['getByRole']>[1],
        value: string
    ): Promise<void> {
        await this.page.getByRole(role, options).selectOption(value);
    }

    // ─── Visibility Checks ──────────────────────────────────────────────────────

    async isVisible(locator: Locator): Promise<boolean> {
        return locator.isVisible();
    }

    async isRoleVisible(
        role: Parameters<Page['getByRole']>[0],
        options?: Parameters<Page['getByRole']>[1]
    ): Promise<boolean> {
        return this.page.getByRole(role, options).isVisible();
    }

    // ─── Assertions (Allure-Step-Compatible) ────────────────────────────────────

    async assertTitleContains(text: string): Promise<void> {
        await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
    }

    async assertURLContains(text: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(text, 'i'));
    }

    async assertTextVisible(text: string): Promise<void> {
        await expect(this.page.getByText(text).first()).toBeVisible();
    }

    async assertRoleVisible(
        role: Parameters<Page['getByRole']>[0],
        options?: Parameters<Page['getByRole']>[1]
    ): Promise<void> {
        await expect(this.page.getByRole(role, options)).toBeVisible();
    }

    async assertRoleHasText(
        role: Parameters<Page['getByRole']>[0],
        options: Parameters<Page['getByRole']>[1],
        expectedText: string
    ): Promise<void> {
        await expect(this.page.getByRole(role, options)).toContainText(expectedText);
    }

    // ─── File Upload ─────────────────────────────────────────────────────────────

    async uploadFile(label: string, filePath: string): Promise<void> {
        await this.page.getByLabel(label).setInputFiles(filePath);
    }

    // ─── Scroll ──────────────────────────────────────────────────────────────────

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async scrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    // ─── Alerts/Dialogs ──────────────────────────────────────────────────────────

    async acceptDialog(): Promise<void> {
        this.page.once('dialog', (dialog) => dialog.accept());
    }
}

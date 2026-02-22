import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactFormData } from '../types/TestData.types';
import path from 'path';

/**
 * ContactUsPage - Handles the contact us form.
 * URL: https://automationexercise.com/contact_us
 */
export class ContactUsPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // ─── Navigation ─────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.navigate('/contact_us');
    }

    // ─── Form Actions ────────────────────────────────────────────────────────────

    async enterName(name: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
    }

    async enterEmail(email: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    }

    async enterSubject(subject: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Subject' }).fill(subject);
    }

    async enterMessage(message: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Your Message Here' }).fill(message);
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.page.locator('input[name="upload_file"]').setInputFiles(filePath);
    }

    async submitForm(): Promise<void> {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async clickHomeButton(): Promise<void> {
        await this.page.getByRole('link', { name: ' Home' }).click();
    }

    // ─── Complete Form Fill ──────────────────────────────────────────────────────

    async fillContactForm(data: ContactFormData): Promise<void> {
        await this.enterName(data.name);
        await this.enterEmail(data.email);
        await this.enterSubject(data.subject);
        await this.enterMessage(data.message);
    }

    // ─── Verifications ───────────────────────────────────────────────────────────

    async verifyContactPageLoaded(): Promise<void> {
        await expect(this.page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
    }

    async verifySuccessMessage(): Promise<void> {
        await expect(
            this.page.getByText('Success! Your details have been submitted successfully.')
        ).toBeVisible({ timeout: 15000 });
    }

    async isSuccessMessageVisible(): Promise<boolean> {
        return this.page
            .getByText('Success! Your details have been submitted successfully.')
            .isVisible();
    }
}

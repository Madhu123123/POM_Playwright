import ExcelJS from 'exceljs';
import path from 'path';
import { TestControl } from '../types/TestData.types';

const EXCEL_FILE_PATH = path.resolve(__dirname, '../data/TestControl.xlsx');
const CONTROL_SHEET = 'TestControl';

/**
 * ExcelHelper - Reads/Writes Excel files for test data and test control.
 * Uses ExcelJS library for full .xlsx support.
 */
export class ExcelHelper {
    private static workbook: ExcelJS.Workbook | null = null;

    /**
     * Loads (lazy) the workbook from the Excel file
     */
    private static async getWorkbook(): Promise<ExcelJS.Workbook> {
        if (!this.workbook) {
            this.workbook = new ExcelJS.Workbook();
            await this.workbook.xlsx.readFile(EXCEL_FILE_PATH);
        }
        return this.workbook;
    }

    /**
     * Resets the cached workbook (use between test suites if needed)
     */
    static resetCache(): void {
        this.workbook = null;
    }

    /**
     * Returns whether a specific test should run based on the TestControl sheet.
     * Looks up the TestID column and checks if Run = 'Y'
     */
    static async shouldRun(testId: string): Promise<boolean> {
        try {
            const workbook = await this.getWorkbook();
            const sheet = workbook.getWorksheet(CONTROL_SHEET);

            if (!sheet) {
                console.warn(`⚠️  Sheet "${CONTROL_SHEET}" not found. Running test by default.`);
                return true;
            }

            let headers: string[] = [];
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers = (row.values as string[]).map((v) => String(v || '').trim());
                }
            });

            const testIdIdx = headers.indexOf('TestID');
            const runIdx = headers.indexOf('Run');

            if (testIdIdx < 0 || runIdx < 0) {
                console.warn('⚠️  TestID or Run column not found in Excel. Running test by default.');
                return true;
            }

            let shouldRun = true;
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
                const rowValues = row.values as (string | null)[];
                const id = String(rowValues[testIdIdx] || '').trim();
                const runValue = String(rowValues[runIdx] || '').trim().toUpperCase();
                if (id === testId) {
                    shouldRun = runValue === 'Y';
                }
            });

            return shouldRun;
        } catch (error) {
            console.error(`Error reading Excel file: ${error}`);
            return true; // fail-safe: run if Excel can't be read
        }
    }

    /**
     * Returns all test control entries from the TestControl sheet
     */
    static async getAllTestControls(): Promise<TestControl[]> {
        const workbook = await this.getWorkbook();
        const sheet = workbook.getWorksheet(CONTROL_SHEET);
        const controls: TestControl[] = [];

        if (!sheet) return controls;

        let headers: string[] = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                headers = (row.values as string[]).map((v) => String(v || '').trim());
                return;
            }
            const rowValues = row.values as string[];
            controls.push({
                testId: String(rowValues[headers.indexOf('TestID')] || '').trim(),
                testName: String(rowValues[headers.indexOf('TestName')] || '').trim(),
                run: (String(rowValues[headers.indexOf('Run')] || 'N').trim().toUpperCase() as 'Y' | 'N'),
                description: String(rowValues[headers.indexOf('Description')] || '').trim(),
                priority: (String(rowValues[headers.indexOf('Priority')] || 'Medium').trim() as 'High' | 'Medium' | 'Low'),
                tag: String(rowValues[headers.indexOf('Tag')] || '').trim(),
            });
        });

        return controls;
    }

    /**
     * Reads data from a specific sheet and returns rows as typed records
     */
    static async getSheetData<T>(sheetName: string): Promise<T[]> {
        const workbook = await this.getWorkbook();
        const sheet = workbook.getWorksheet(sheetName);
        const results: T[] = [];

        if (!sheet) {
            console.warn(`Sheet "${sheetName}" not found.`);
            return results;
        }

        let headers: string[] = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                headers = (row.values as string[]).map((v) => String(v || '').trim());
                return;
            }
            const obj: Record<string, string> = {};
            const rowValues = row.values as string[];
            headers.forEach((header, idx) => {
                if (header) {
                    obj[header] = String(rowValues[idx] || '').trim();
                }
            });
            results.push(obj as unknown as T);
        });

        return results;
    }

    /**
     * Updates the Run column for a specific test ID (useful after test run)
     */
    static async updateRunStatus(testId: string, status: 'Y' | 'N'): Promise<void> {
        const workbook = await this.getWorkbook();
        const sheet = workbook.getWorksheet(CONTROL_SHEET);

        if (!sheet) return;

        let headers: string[] = [];
        let testIdIdx = -1;
        let runIdx = -1;

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                headers = (row.values as string[]).map((v) => String(v || '').trim());
                testIdIdx = headers.indexOf('TestID');
                runIdx = headers.indexOf('Run');
                return;
            }
            const rowValues = row.values as string[];
            const id = String(rowValues[testIdIdx] || '').trim();
            if (id === testId) {
                row.getCell(runIdx).value = status;
            }
        });

        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
        this.workbook = null; // reset cache after write
    }
}

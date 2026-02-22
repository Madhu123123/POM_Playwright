/**
 * setupExcel.ts - Script to generate the TestControl.xlsx file with all 10 test cases.
 * Run: npx ts-node src/scripts/setupExcel.ts
 *
 * The Excel file has:
 *  - TestControl sheet: controls which tests to run (Run = Y/N)
 *  - LoginData sheet: login credentials
 */

import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

const OUTPUT_PATH = path.resolve(__dirname, '../data/TestControl.xlsx');

async function generateExcel(): Promise<void> {
    // Ensure data directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'QA Automation Framework';
    workbook.created = new Date();

    // ─── Sheet 1: TestControl ─────────────────────────────────────────────────
    const controlSheet = workbook.addWorksheet('TestControl');

    // Header row styling
    controlSheet.columns = [
        { header: 'TestID', key: 'testId', width: 12 },
        { header: 'TestName', key: 'testName', width: 40 },
        { header: 'Run', key: 'run', width: 8 },
        { header: 'Description', key: 'description', width: 60 },
        { header: 'Priority', key: 'priority', width: 12 },
        { header: 'Tag', key: 'tag', width: 20 },
    ];

    // Style header row
    const headerRow = controlSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 22;

    // Test data rows — set Run to Y or N to control execution
    const testCases = [
        { testId: 'TC001', testName: 'Home Page Navigation', run: 'Y', description: 'Verify home page loads with navigation links, featured items, categories', priority: 'High', tag: 'smoke,regression' },
        { testId: 'TC002', testName: 'User Registration', run: 'Y', description: 'Register new user account with dynamically generated data', priority: 'High', tag: 'regression' },
        { testId: 'TC003', testName: 'User Login - Valid', run: 'Y', description: 'Login with valid credentials and verify successful login', priority: 'High', tag: 'smoke,regression' },
        { testId: 'TC004', testName: 'User Login - Invalid', run: 'Y', description: 'Login with invalid credentials and verify error message', priority: 'Medium', tag: 'regression' },
        { testId: 'TC005', testName: 'Product Search', run: 'Y', description: 'Search for a product keyword and verify results', priority: 'Medium', tag: 'regression' },
        { testId: 'TC006', testName: 'Add Product to Cart', run: 'Y', description: 'View product detail, set quantity, add to cart and verify', priority: 'High', tag: 'smoke,regression' },
        { testId: 'TC007', testName: 'Checkout Flow', run: 'Y', description: 'End-to-end checkout: login → add → checkout → payment → confirm', priority: 'High', tag: 'e2e,regression' },
        { testId: 'TC008', testName: 'Contact Us Form', run: 'Y', description: 'Fill and submit Contact Us form, verify success message', priority: 'Medium', tag: 'regression' },
        { testId: 'TC009', testName: 'Email Subscription', run: 'Y', description: 'Subscribe to newsletter via footer and verify success', priority: 'Low', tag: 'regression' },
        { testId: 'TC010', testName: 'Logout Flow', run: 'Y', description: 'Login then logout and verify redirect to login page', priority: 'Medium', tag: 'smoke,regression' },
    ];

    testCases.forEach((tc, idx) => {
        const row = controlSheet.addRow(tc);
        row.height = 20;
        row.alignment = { vertical: 'middle' };

        // Alternate row colors
        if (idx % 2 === 0) {
            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FC' } };
        }

        // Color the Run cell: Y = green, N = red (use column key 'run' as defined)
        const runCell = row.getCell('run');
        if (tc.run === 'Y') {
            runCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };
            runCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        } else {
            runCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
            runCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        }
        runCell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Auto-filter on header
    controlSheet.autoFilter = { from: 'A1', to: 'F1' };

    // Freeze header row
    controlSheet.views = [{ state: 'frozen', ySplit: 1 }];

    // ─── Sheet 2: LoginData ───────────────────────────────────────────────────
    const loginSheet = workbook.addWorksheet('LoginData');
    loginSheet.columns = [
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Password', key: 'password', width: 20 },
        { header: 'Expected', key: 'expected', width: 12 },
    ];

    const loginHeader = loginSheet.getRow(1);
    loginHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    loginHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
    loginHeader.height = 22;

    loginSheet.addRow({ type: 'Valid', email: 'testuser@mailinator.com', password: 'Test@1234', expected: 'success' });
    loginSheet.addRow({ type: 'Invalid', email: 'invalid@mailinator.com', password: 'WrongPass!', expected: 'failure' });

    loginSheet.views = [{ state: 'frozen', ySplit: 1 }];

    // ─── Save ─────────────────────────────────────────────────────────────────
    await workbook.xlsx.writeFile(OUTPUT_PATH);
    console.log(`✅ TestControl.xlsx created at: ${OUTPUT_PATH}`);
    console.log(`\n📋 Test Control Summary:`);
    console.log(`   Total Tests: ${testCases.length}`);
    console.log(`   Tests to Run (Y): ${testCases.filter(t => t.run === 'Y').length}`);
    console.log(`   Tests to Skip (N): ${testCases.filter(t => t.run === 'N').length}`);
    console.log(`\n💡 To skip a test: open TestControl.xlsx and change Run column from Y to N`);
}

generateExcel().catch((err) => {
    console.error('❌ Error generating Excel file:', err);
    process.exit(1);
});

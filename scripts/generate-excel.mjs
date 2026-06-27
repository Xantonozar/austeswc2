import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as XLSX from 'xlsx';

// ── Shared Styles ──
const BRAND = {
    darkGreen: '1B4B43',
    medGreen: '2D7A6E',
    lightGreen: 'D9F2D6',
    paleGreen: 'EAF7E8',
    accent: '4CAF50',
    white: 'FFFFFF',
    offWhite: 'F8FAF7',
    textDark: '1A1A1A',
    textMuted: '6B7280',
    border: 'C8E6C9',
};

function styleHeader(ws, cols) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
        const cell = ws[addr];
        if (!cell) continue;
        cell.s = {
            fill: { fgColor: { rgb: BRAND.darkGreen } },
            font: { bold: true, color: { rgb: BRAND.white }, sz: 11, name: 'Calibri' },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: [
                { top: { style: 'thin', color: { rgb: BRAND.medGreen } } },
                { bottom: { style: 'thin', color: { rgb: BRAND.medGreen } } },
                { left: { style: 'thin', color: { rgb: BRAND.medGreen } } },
                { right: { style: 'thin', color: { rgb: BRAND.medGreen } } },
            ],
        };
    }
    ws['!rows'] = [{ hpt: 28 }];
}

function styleDataRows(ws) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; R++) {
        const isEven = R % 2 === 0;
        for (let C = range.s.c; C <= range.e.c; C++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[addr];
            if (!cell) continue;
            cell.s = {
                fill: { fgColor: { rgb: isEven ? BRAND.paleGreen : BRAND.white } },
                font: { color: { rgb: BRAND.textDark }, sz: 10, name: 'Calibri' },
                alignment: { vertical: 'center', wrapText: true },
                border: [
                    { bottom: { style: 'thin', color: { rgb: BRAND.border } } },
                ],
            };
        }
    }
}

function autoWidth(ws) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    const widths = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
        let max = 10;
        for (let R = range.s.r; R <= range.e.r; R++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[addr];
            if (cell) {
                const len = String(cell.v || '').length;
                if (len > max) max = len;
            }
        }
        widths.push({ wch: Math.min(max + 4, 40) });
    }
    ws['!cols'] = widths;
}

// ── Batch Ambassadors ──
function createBatchAmbassadors() {
    const data = JSON.parse(readFileSync(resolve('batch-ambassadors.json'), 'utf8'));
    const rows = data.map((d, i) => ({
        '#': i + 1,
        'Name': (d.name || '').trim(),
        'Email': d.email,
        'Phone': d.phone,
        'Student ID': d.studentId,
        'Department': d.department,
        'Semester': d.semester,
        'Section': d.section || '-',
        'Motivation': d.motivation,
        'Experience': d.experience || '-',
        'Other Club Ambassador': d.isOtherClubAmbassador,
        'Convince Strategy': d.convinceStrategy,
        'Status': d.status,
        'Applied': new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows, {
        header: Object.keys(rows[0]),
    });

    styleHeader(ws);
    styleDataRows(ws);
    autoWidth(ws);

    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    XLSX.utils.book_append_sheet(wb, ws, 'Batch Ambassadors');
    XLSX.writeFile(wb, 'Batch_Ambassadors.xlsx');
    console.log('✓ Batch_Ambassadors.xlsx created');
}

// ── Paid Competitions ──
function createPaidCompetitions() {
    const data = JSON.parse(readFileSync(resolve('paid-competitions.json'), 'utf8'));
    const rows = data.map((d, i) => ({
        '#': i + 1,
        'Name': d.name,
        'Email': d.email,
        'Phone': d.phone,
        'Competition': d.competition.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        'Amount (BDT)': d.amount,
        'Payment Method': (d.paymentMethod || '').toUpperCase(),
        'Payment Tx ID': d.paymentNumber,
        'Verified': d.verified ? '✓ Yes' : '✗ No',
        'Round': `Round ${d.round}`,
        'Registered': new Date(d.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows, {
        header: Object.keys(rows[0]),
    });

    styleHeader(ws);
    styleDataRows(ws);
    autoWidth(ws);

    // Highlight amount column with bold green
    const range = XLSX.utils.decode_range(ws['!ref']);
    const amtCol = 5; // 'Amount (BDT)' column index
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: amtCol });
        const cell = ws[addr];
        if (cell) {
            cell.s = {
                ...cell.s,
                font: { ...cell.s?.font, bold: true, color: { rgb: BRAND.darkGreen } },
            };
        }
    }

    // Status column coloring
    const verifiedCol = 8; // 'Verified' column index
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: verifiedCol });
        const cell = ws[addr];
        if (cell) {
            const isYes = String(cell.v).includes('Yes');
            cell.s = {
                ...cell.s,
                font: {
                    ...cell.s?.font,
                    bold: true,
                    color: { rgb: isYes ? '16A34A' : 'DC2626' },
                },
            };
        }
    }

    // Summary row
    const sumRow = range.e.r + 2;
    const totalAddr = XLSX.utils.encode_cell({ r: sumRow, c: amtCol - 1 });
    ws[totalAddr] = { v: 'TOTAL:', t: 's' };
    ws[totalAddr].s = { font: { bold: true, sz: 11, name: 'Calibri', color: { rgb: BRAND.darkGreen } } };

    const totalAmt = XLSX.utils.encode_cell({ r: sumRow, c: amtCol });
    ws[totalAmt] = { v: data.reduce((s, d) => s + d.amount, 0), t: 'n' };
    ws[totalAmt].s = { font: { bold: true, sz: 12, name: 'Calibri', color: { rgb: BRAND.darkGreen } } };
    ws[totalAmt].z = '#,##0';

    const countAddr = XLSX.utils.encode_cell({ r: sumRow, c: 0 });
    ws[countAddr] = { v: `${data.length} entries`, t: 's' };
    ws[countAddr].s = { font: { italic: true, sz: 10, name: 'Calibri', color: { rgb: BRAND.textMuted } } };

    // Update sheet range
    ws['!ref'] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: sumRow, c: range.e.c },
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Paid Competitions');
    XLSX.writeFile(wb, 'Paid_Competitions.xlsx');
    console.log('✓ Paid_Competitions.xlsx created');
}

createBatchAmbassadors();
createPaidCompetitions();
console.log('\nDone!');

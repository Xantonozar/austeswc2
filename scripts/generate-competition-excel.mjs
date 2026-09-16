import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as XLSX from 'xlsx';

// ── Club Brand Colors ──
const BRAND = {
    darkGreen: '1B4B43',
    medGreen: '2D7A6E',
    lightGreen: 'D9F2D6',
    paleGreen: 'EAF7E8',
    accent: '4CAF50',
    gold: 'D4A843',
    white: 'FFFFFF',
    textDark: '1A1A1A',
    textMuted: '6B7280',
    border: 'C8E6C9',
    red: 'DC2626',
    green: '16A34A',
};

const CATEGORY_LABELS = {
    'eco-buzzers': 'Eco Buzzers',
    'eco-capture': 'Eco Capture',
    'eco-pitch': 'Eco Pitch',
    'green-story': 'Green Story',
};

const CATEGORY_COLORS = {
    'eco-buzzers': '1B4B43',
    'eco-capture': '2D7A6E',
    'eco-pitch': '145A3C',
    'green-story': '0F6B3A',
};

// ── Styling Helpers ──
function styleHeader(ws, brandColor) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
        const cell = ws[addr];
        if (!cell) continue;
        cell.s = {
            fill: { fgColor: { rgb: brandColor || BRAND.darkGreen } },
            font: { bold: true, color: { rgb: BRAND.white }, sz: 11, name: 'Calibri' },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: [
                { top: { style: 'medium', color: { rgb: BRAND.white } } },
                { bottom: { style: 'medium', color: { rgb: BRAND.white } } },
                { left: { style: 'thin', color: { rgb: brandColor || BRAND.darkGreen } } },
                { right: { style: 'thin', color: { rgb: brandColor || BRAND.darkGreen } } },
            ],
        };
    }
    ws['!rows'] = [{ hpt: 30 }];
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
        let max = 8;
        for (let R = range.s.r; R <= range.e.r; R++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[addr];
            if (cell) {
                const len = String(cell.v || '').length;
                if (len > max) max = len;
            }
        }
        widths.push({ wch: Math.min(max + 4, 45) });
    }
    ws['!cols'] = widths;
}

function addSummaryRow(ws, totalAmount, count, range) {
    const sumRow = range.e.r + 2;

    // "TOTAL" label
    const labelAddr = XLSX.utils.encode_cell({ r: sumRow, c: 0 });
    ws[labelAddr] = { v: `${count} entries`, t: 's' };
    ws[labelAddr].s = { font: { italic: true, sz: 10, name: 'Calibri', color: { rgb: BRAND.textMuted } } };

    // Amount column
    const amtCol = Array.from({ length: range.e.c + 1 }, (_, i) => i).find(c => {
        const addr = XLSX.utils.encode_cell({ r: 0, c: c });
        return ws[addr] && String(ws[addr].v).includes('Amount');
    });

    if (typeof amtCol === 'number') {
        const totalAddr = XLSX.utils.encode_cell({ r: sumRow, c: amtCol });
        ws[totalAddr] = { v: totalAmount, t: 'n' };
        ws[totalAddr].s = { font: { bold: true, sz: 12, name: 'Calibri', color: { rgb: BRAND.darkGreen } } };
        ws[totalAddr].z = '#,##0';

        // "TOTAL:" label before amount
        const totalLabelAddr = XLSX.utils.encode_cell({ r: sumRow, c: amtCol - 1 });
        ws[totalLabelAddr] = { v: 'TOTAL:', t: 's' };
        ws[totalLabelAddr].s = { font: { bold: true, sz: 11, name: 'Calibri', color: { rgb: BRAND.darkGreen } } };
    }

    ws['!ref'] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: sumRow, c: range.e.c },
    });
}

// ── Eco Buzzers ──
function createEcoBuzzers() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/eco-buzzers.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    // Main sheet
    const mainRows = data.map((d, i) => ({
        '#': i + 1,
        'Team Name': d.teamName,
        'Contact Person': d.name,
        'Phone': d.phone,
        'Email': d.email,
        'Tx ID': d.transactionId,
        'Amount (BDT)': d.paymentAmount,
        'Method': d.paymentMethod,
        'Paid Round': d.paidRound ? `Round ${d.paidRound}` : '-',
        'University': d.universityName || '-',
        'Status': d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(mainRows, { header: Object.keys(mainRows[0]) });
    styleHeader(ws, CATEGORY_COLORS['eco-buzzers']);
    styleDataRows(ws);
    autoWidth(ws);

    // Highlight amount
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 6 });
        const cell = ws[addr];
        if (cell) cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: BRAND.darkGreen } } };
    }

    const totalAmount = data.reduce((s, d) => s + d.paymentAmount, 0);
    addSummaryRow(ws, totalAmount, data.length, range);
    XLSX.utils.book_append_sheet(wb, ws, 'Paid Teams');

    // Members sheet
    const memberRows = [];
    data.forEach(d => {
        (d.members || []).forEach(m => {
            memberRows.push({
                'Team Name': d.teamName,
                'Member Name': m.name,
                'Phone': m.phone,
                'Email': m.email,
                'Student ID': m.studentId || '-',
                'University': m.university || '-',
            });
        });
    });
    if (memberRows.length) {
        const ws2 = XLSX.utils.json_to_sheet(memberRows, { header: Object.keys(memberRows[0]) });
        styleHeader(ws2, CATEGORY_COLORS['eco-buzzers']);
        styleDataRows(ws2);
        autoWidth(ws2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Team Members');
    }

    XLSX.writeFile(wb, 'Eco_Buzzers.xlsx');
    console.log(`✓ Eco_Buzzers.xlsx — ${data.length} teams, ${memberRows.length} members`);
}

// ── Eco Capture ──
function createEcoCapture() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/eco-capture.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    const mainRows = data.map((d, i) => ({
        '#': i + 1,
        'Name': d.name,
        'Phone': d.phone,
        'Email': d.email,
        'Tx ID': d.transactionId || '-',
        'Amount (BDT)': d.paymentAmount || 0,
        'Method': d.paymentMethod || '-',
        'Paid Round': d.paidRound ? `Round ${d.paidRound}` : 'Not Paid',
        'Photos': d.photos?.length || 0,
        'Selected': d.selectedPhotoCount || 0,
        'Status': d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(mainRows, { header: Object.keys(mainRows[0]) });
    styleHeader(ws, CATEGORY_COLORS['eco-capture']);
    styleDataRows(ws);
    autoWidth(ws);

    // Highlight paidRound column
    const range = XLSX.utils.decode_range(ws['!ref']);
    const paidRoundCol = 7;
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: paidRoundCol });
        const cell = ws[addr];
        if (cell) {
            const val = String(cell.v);
            cell.s = {
                ...cell.s,
                font: {
                    ...cell.s?.font,
                    bold: true,
                    color: { rgb: val.includes('Round') ? BRAND.green : BRAND.red },
                },
            };
        }
    }

    // Amount column bold
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 5 });
        const cell = ws[addr];
        if (cell) cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: BRAND.darkGreen } } };
    }

    const totalAmount = data.reduce((s, d) => s + (d.paymentAmount || 0), 0);
    addSummaryRow(ws, totalAmount, data.length, range);
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');

    // Photos detail sheet
    const photoRows = [];
    data.forEach(d => {
        (d.photos || []).forEach((p, idx) => {
            photoRows.push({
                'Name': d.name,
                'Photo #': idx + 1,
                'Story': p.story || '-',
                'Selected': p.selected ? '✓ Yes' : '✗ No',
            });
        });
    });
    if (photoRows.length) {
        const ws2 = XLSX.utils.json_to_sheet(photoRows, { header: Object.keys(photoRows[0]) });
        styleHeader(ws2, CATEGORY_COLORS['eco-capture']);
        styleDataRows(ws2);
        autoWidth(ws2);

        // Color the Selected column
        const r2 = XLSX.utils.decode_range(ws2['!ref']);
        const selCol = 3;
        for (let R = 1; R <= r2.e.r; R++) {
            const addr = XLSX.utils.encode_cell({ r: R, c: selCol });
            const cell = ws2[addr];
            if (cell) {
                const isYes = String(cell.v).includes('Yes');
                cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: isYes ? BRAND.green : BRAND.red } } };
            }
        }
        XLSX.utils.book_append_sheet(wb, ws2, 'Photo Details');
    }

    XLSX.writeFile(wb, 'Eco_Capture.xlsx');
    console.log(`✓ Eco_Capture.xlsx — ${data.length} participants, ${photoRows.length} photos`);
}

// ── Eco Pitch ──
function createEcoPitch() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/eco-pitch.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    const mainRows = data.map((d, i) => ({
        '#': i + 1,
        'Name': d.name,
        'Phone': d.phone,
        'Email': d.email,
        'Tx ID': d.transactionId,
        'Amount (BDT)': d.paymentAmount,
        'Method': d.paymentMethod,
        'Paid Round': d.paidRound ? `Round ${d.paidRound}` : '-',
        'PDF': d.pdfUrl ? '✓ Uploaded' : '✗ Missing',
        'Status': d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(mainRows, { header: Object.keys(mainRows[0]) });
    styleHeader(ws, CATEGORY_COLORS['eco-pitch']);
    styleDataRows(ws);
    autoWidth(ws);

    const range = XLSX.utils.decode_range(ws['!ref']);

    // Amount bold green
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 5 });
        const cell = ws[addr];
        if (cell) cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: BRAND.darkGreen } } };
    }

    // PDF status color
    const pdfCol = 8;
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: pdfCol });
        const cell = ws[addr];
        if (cell) {
            const ok = String(cell.v).includes('Uploaded');
            cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: ok ? BRAND.green : BRAND.red } } };
        }
    }

    const totalAmount = data.reduce((s, d) => s + d.paymentAmount, 0);
    addSummaryRow(ws, totalAmount, data.length, range);
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');

    XLSX.writeFile(wb, 'Eco_Pitch.xlsx');
    console.log(`✓ Eco_Pitch.xlsx — ${data.length} participants`);
}

// ── Green Story ──
function createGreenStory() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/green-story.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    const mainRows = data.map((d, i) => ({
        '#': i + 1,
        'Team Name': d.teamName,
        'Contact Person': d.name,
        'Phone': d.phone,
        'Email': d.email,
        'Tx ID': d.transactionId,
        'Amount (BDT)': d.paymentAmount,
        'Method': d.paymentMethod,
        'Paid Round': d.paidRound ? `Round ${d.paidRound}` : '-',
        'University': d.universityName || '-',
        'Status': d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(mainRows, { header: Object.keys(mainRows[0]) });
    styleHeader(ws, CATEGORY_COLORS['green-story']);
    styleDataRows(ws);
    autoWidth(ws);

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: 6 });
        const cell = ws[addr];
        if (cell) cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: BRAND.darkGreen } } };
    }

    const totalAmount = data.reduce((s, d) => s + d.paymentAmount, 0);
    addSummaryRow(ws, totalAmount, data.length, range);
    XLSX.utils.book_append_sheet(wb, ws, 'Paid Teams');

    // Members sheet
    const memberRows = [];
    data.forEach(d => {
        (d.members || []).forEach(m => {
            memberRows.push({
                'Team Name': d.teamName,
                'Member Name': m.name,
                'Phone': m.phone,
                'Email': m.email,
                'Student ID': m.studentId || '-',
                'University': m.university || '-',
            });
        });
    });
    if (memberRows.length) {
        const ws2 = XLSX.utils.json_to_sheet(memberRows, { header: Object.keys(memberRows[0]) });
        styleHeader(ws2, CATEGORY_COLORS['green-story']);
        styleDataRows(ws2);
        autoWidth(ws2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Team Members');
    }

    XLSX.writeFile(wb, 'Green_Story.xlsx');
    console.log(`✓ Green_Story.xlsx — ${data.length} teams, ${memberRows.length} members`);
}

// ── Eco Frame ──
function createEcoFrame() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/eco-frame.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    const mainRows = data.map((d, i) => ({
        '#': i + 1,
        'Name': d.name,
        'Student ID': d.studentId || '-',
        'Email': d.email,
        'Phone': d.phone || '-',
        'Department': d.department || '-',
        'Semester': d.semester || '-',
        'Tx ID': d.transactionId || '-',
        'Payment Status': d.paymentStatus || '-',
        'Payment Verified': d.paymentVerified ? 'YES' : 'NO',
        'Photos': d.photos?.length || 0,
        'Status': d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(mainRows, { header: Object.keys(mainRows[0]) });
    styleHeader(ws, '145A3C');
    styleDataRows(ws);
    autoWidth(ws);

    const range = XLSX.utils.decode_range(ws['!ref']);

    // Payment Status color
    const payCol = 8;
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: payCol });
        const cell = ws[addr];
        if (cell) {
            const val = String(cell.v);
            cell.s = {
                ...cell.s,
                font: {
                    ...cell.s?.font,
                    bold: true,
                    color: { rgb: val === 'YES' ? BRAND.green : BRAND.red },
                },
            };
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Participants');

    // Photos detail sheet
    const photoRows = [];
    data.forEach(d => {
        (d.photos || []).forEach((p, idx) => {
            photoRows.push({
                'Name': d.name,
                'Student ID': d.studentId || '-',
                'Photo #': idx + 1,
                'Theme': p.theme || '-',
                'Title': p.title || '-',
                'Description': p.caption || '-',
                'Image URL': p.url || '-',
            });
        });
    });
    if (photoRows.length) {
        const ws2 = XLSX.utils.json_to_sheet(photoRows, { header: Object.keys(photoRows[0]) });
        styleHeader(ws2, '145A3C');
        styleDataRows(ws2);
        autoWidth(ws2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Photo Details');
    }

    XLSX.writeFile(wb, 'Eco_Frame.xlsx');
    console.log(`✓ Eco_Frame.xlsx — ${data.length} participants, ${photoRows.length} photos`);
}

// ── Poster Presentation ──
function createPosterPresentation() {
    const data = JSON.parse(readFileSync(resolve('competitions-by-category/poster-presentation.json'), 'utf8'));
    const wb = XLSX.utils.book_new();

    // Team overview sheet
    const teamRows = data.map((d, i) => ({
        '#': i + 1,
        'Team Name': d.teamName || '-',
        'Track': d.trackCategory || '-',
        'Poster Title': d.posterTitle || '-',
        'R2 Poster Title': d.round2PosterTitle || '-',
        'Leader Email': d.email || '-',
        'Leader Phone': d.phone || '-',
        'CA Reference': d.caReference || '-',
        'Abstract': d.abstractUrl ? '✓ Uploaded' : '✗ Missing',
        'Members': d.members?.length || 0,
        'AI Confirmed': d.confirmAi ? 'YES' : 'NO',
        'R2 Tx ID': d.round2Payment?.transactionId || '-',
        'R2 Amount': d.round2Payment?.amount || '-',
        'R2 Verified': d.round2Payment?.verified ? 'YES' : 'NO',
        'Status': d.status || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(teamRows, { header: Object.keys(teamRows[0]) });
    styleHeader(ws, '4A148C');
    styleDataRows(ws);
    autoWidth(ws);

    const range = XLSX.utils.decode_range(ws['!ref']);

    // R2 Verified color
    const verifiedCol = 13;
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: verifiedCol });
        const cell = ws[addr];
        if (cell) {
            const val = String(cell.v);
            cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: val === 'YES' ? BRAND.green : BRAND.red } } };
        }
    }

    // Abstract status color
    const abstractCol = 8;
    for (let R = 1; R <= range.e.r; R++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: abstractCol });
        const cell = ws[addr];
        if (cell) {
            const ok = String(cell.v).includes('Uploaded');
            cell.s = { ...cell.s, font: { ...cell.s?.font, bold: true, color: { rgb: ok ? BRAND.green : BRAND.red } } };
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Teams');

    // Members sheet
    const memberRows = [];
    data.forEach((d, idx) => {
        (d.members || []).forEach((m, mIdx) => {
            memberRows.push({
                '#': idx + 1,
                'Team Name': d.teamName || '-',
                'Role': m.isLeader ? 'Leader' : `Member ${mIdx + 1}`,
                'Name': m.name || '-',
                'Student ID': m.studentId || '-',
                'Email': m.email || '-',
                'Phone': m.phone || '-',
                'Department': m.department || '-',
                'Year': m.year || '-',
                'Semester': m.semester || '-',
                'Profile Photo': m.photoUrl || '-',
            });
        });
    });
    if (memberRows.length) {
        const ws2 = XLSX.utils.json_to_sheet(memberRows, { header: Object.keys(memberRows[0]) });
        ws2['!cols'] = [
            { wch: 5 },   // #
            { wch: 22 },  // Team Name
            { wch: 10 },  // Role
            { wch: 22 },  // Name
            { wch: 15 },  // Student ID
            { wch: 28 },  // Email
            { wch: 16 },  // Phone
            { wch: 12 },  // Department
            { wch: 12 },  // Year
            { wch: 18 },  // Semester
            { wch: 55 },  // Profile Photo URL
        ];
        const r2 = XLSX.utils.decode_range(ws2['!ref']);
        for (let C = r2.s.c; C <= r2.e.c; C++) {
            const addr = XLSX.utils.encode_cell({ r: 0, c: C });
            const cell = ws2[addr];
            if (!cell) continue;
            cell.s = {
                fill: { fgColor: { rgb: '4A148C' } },
                font: { bold: true, color: { rgb: BRAND.white }, sz: 11, name: 'Calibri' },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: [
                    { top: { style: 'medium', color: { rgb: BRAND.white } } },
                    { bottom: { style: 'medium', color: { rgb: BRAND.white } } },
                    { left: { style: 'thin', color: { rgb: '4A148C' } } },
                    { right: { style: 'thin', color: { rgb: '4A148C' } } },
                ],
            };
        }
        ws2['!rows'] = [{ hpt: 28 }];
        for (let R = 1; R <= r2.e.r; R++) {
            const isEven = R % 2 === 0;
            for (let C = r2.s.c; C <= r2.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = ws2[addr];
                if (!cell) continue;
                cell.s = {
                    fill: { fgColor: { rgb: isEven ? 'F3E5F5' : BRAND.white } },
                    font: { color: { rgb: BRAND.textDark }, sz: 10, name: 'Calibri' },
                    alignment: { vertical: 'center', wrapText: true },
                    border: [{ bottom: { style: 'thin', color: { rgb: 'E1BEE7' } } }],
                };
            }
        }
        XLSX.utils.book_append_sheet(wb, ws2, 'Team Members');
    }

    // Round 2 payment sheet (if any)
    const r2Rows = [];
    data.forEach(d => {
        if (d.round2Payment?.transactionId) {
            r2Rows.push({
                'Team Name': d.teamName || '-',
                'Tx ID': d.round2Payment.transactionId,
                'Method': d.round2Payment.paymentMethod || '-',
                'Amount': d.round2Payment.amount || 0,
                'Verified': d.round2Payment.verified ? 'YES' : 'NO',
                'Sender Number': d.round2Payment.senderNumber || '-',
                'Club Member': d.round2Payment.isClubMember ? 'YES' : 'NO',
                'Club Member ID': d.round2Payment.clubMemberId || '-',
                'Screenshot': d.round2Payment.screenshotUrl || '-',
                'Team Photos': d.round2Payment.teamPhotos?.join(', ') || '-',
            });
        }
    });
    if (r2Rows.length) {
        const ws3 = XLSX.utils.json_to_sheet(r2Rows, { header: Object.keys(r2Rows[0]) });
        ws3['!cols'] = [
            { wch: 22 },  // Team Name
            { wch: 18 },  // Tx ID
            { wch: 10 },  // Method
            { wch: 10 },  // Amount
            { wch: 10 },  // Verified
            { wch: 16 },  // Sender Number
            { wch: 13 },  // Club Member
            { wch: 15 },  // Club Member ID
            { wch: 55 },  // Screenshot
            { wch: 60 },  // Team Photos
        ];
        const r3 = XLSX.utils.decode_range(ws3['!ref']);
        for (let C = r3.s.c; C <= r3.e.c; C++) {
            const addr = XLSX.utils.encode_cell({ r: 0, c: C });
            const cell = ws3[addr];
            if (!cell) continue;
            cell.s = {
                fill: { fgColor: { rgb: '4A148C' } },
                font: { bold: true, color: { rgb: BRAND.white }, sz: 11, name: 'Calibri' },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: [
                    { top: { style: 'medium', color: { rgb: BRAND.white } } },
                    { bottom: { style: 'medium', color: { rgb: BRAND.white } } },
                    { left: { style: 'thin', color: { rgb: '4A148C' } } },
                    { right: { style: 'thin', color: { rgb: '4A148C' } } },
                ],
            };
        }
        ws3['!rows'] = [{ hpt: 28 }];
        for (let R = 1; R <= r3.e.r; R++) {
            const isEven = R % 2 === 0;
            for (let C = r3.s.c; C <= r3.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = ws3[addr];
                if (!cell) continue;
                cell.s = {
                    fill: { fgColor: { rgb: isEven ? 'F3E5F5' : BRAND.white } },
                    font: { color: { rgb: BRAND.textDark }, sz: 10, name: 'Calibri' },
                    alignment: { vertical: 'center', wrapText: true },
                    border: [{ bottom: { style: 'thin', color: { rgb: 'E1BEE7' } } }],
                };
            }
        }
        XLSX.utils.book_append_sheet(wb, ws3, 'R2 Payments');
    }

    XLSX.writeFile(wb, 'Poster_Presentation.xlsx');
    console.log(`✓ Poster_Presentation.xlsx — ${data.length} teams, ${memberRows.length} members, ${r2Rows.length} R2 payments`);
}

// ── Run All ──
createEcoBuzzers();
createEcoCapture();
createEcoFrame();
createEcoPitch();
createGreenStory();
createPosterPresentation();
console.log('\nAll competition Excel files generated!');

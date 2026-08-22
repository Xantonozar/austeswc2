const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'nvidia/nemotron-nano-12b-v2-vl:free';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ─── Visual Schedule Grid & Cell Merge Analyzer Prompt ───────────────────────
const PROMPT = `
# Visual Schedule Grid & Cell Merge Analyzer - System Prompt

## ROLE & OBJECTIVE
You are an expert document-layout and visual table parser. Your task is to convert an image of a class schedule into an exact Excel spreadsheet grid structure (Columns A, B, C... and Rows 1, 2, 3...). You must prioritize physical grid lines over text placement to achieve 100% precision.

---

## STEP 1: FIXED GRID ANCHORING
Identify the header row containing time slots. Assign each time slot strictly to a single Excel column letter starting from Column B up to Column M:
* **Column A:** Time / Day
* **Column B:** 08:00 AM – 08:50 AM
* **Column C:** 08:50 AM – 09:40 AM
* **Column D:** 09:40 AM – 10:30 AM
* **Column E:** 10:30 AM – 11:20 AM
* **Column F:** 11:20 AM – 12:10 PM
* **Column G:** 12:10 PM – 01:00 PM
* **Column H:** 01:00 PM – 01:50 PM
* **Column I:** 01:50 PM – 02:40 PM
* **Column J:** 02:40 PM – 03:30 PM
* **Column K:** 03:30 PM – 04:20 PM
* **Column L:** 04:20 PM – 05:10 PM
* **Column M:** 05:10 PM – 06:00 PM

---

## STEP 2: MANDATORY CHAIN-OF-THOUGHT GRID LINE AUDIT
Before declaring any cell merged or extracting any text, you MUST run a step-by-step visual audit of the vertical dividing lines for the row you are analyzing.
Trace a virtual vertical line down from every time-slot divider in the header. For every row, inspect the vertical column boundaries from left to right and explicitly state if the dividing line is [PRESENT] or [MISSING]:
1. Line between B & C (at 08:50 AM) -> State: [PRESENT] or [MISSING]
2. Line between C & D (at 09:40 AM) -> State: [PRESENT] or [MISSING]
3. Line between D & E (at 10:30 AM) -> State: [PRESENT] or [MISSING]
4. Line between E & F (at 11:20 AM) -> State: [PRESENT] or [MISSING]
5. Line between F & G (at 12:10 PM) -> State: [PRESENT] or [MISSING]
6. Line between G & H (at 01:00 PM) -> State: [PRESENT] or [MISSING]
7. Line between H & I (at 01:50 PM) -> State: [PRESENT] or [MISSING]
8. Line between I & J (at 02:40 PM) -> State: [PRESENT] or [MISSING]
9. Line between J & K (at 03:30 PM) -> State: [PRESENT] or [MISSING]
10. Line between K & L (at 04:20 PM) -> State: [PRESENT] or [MISSING]
11. Line between L & M (at 05:10 PM) -> State: [PRESENT] or [MISSING]

---

## STEP 3: MULTI-SLOT MERGE PROTOCOL & HORIZONTAL SPLITS
* **Missing Lines = Merged Cells:** If a line is [MISSING], the adjacent columns MUST be combined.
* **Maximum Merge Limit Rule:** A merge span can NEVER exceed **3 columns**. A 4-column (or larger) merge is physically impossible in this schedule system. If missing lines span 4 or more columns visually, cap the merge at 3 columns maximum (e.g., H:J = 3-column span) and treat subsequent empty slots as standard unmerged columns.
* **Empty Merges:** If a line is missing and there is no text in that area, you MUST still count it as merged up to the 3-column maximum limit. The blank space is part of the multi-slot merge.
* **Horizontal Sub-divisions (Split Rows):** If a block shares a single horizontal time span (e.g., H:J) but contains horizontal split lines inside it (e.g., parallel lab groups like Group A1 / Group A2), keep the horizontal column range intact (e.g., H:J). List the contents as ordered Sub-rows within that merged span (e.g., H:J Sub-row 1, H:J Sub-row 2).

---

## STEP 4: STRICT NEGATIVE CONSTRAINTS (WHAT TO AVOID)
To maintain 100% grid parsing precision, you must actively fight AI visual biases:
1. **DO NOT Declare 4-Column Merges:** Merges of 4 columns or larger do not exist in this grid design. Cap all merges strictly at 3 columns max (e.g., H:J instead of H:K).
2. **DO NOT Misread Optical Noise as a Grid Line:** Subtle background gradients, low-contrast JPEG compression artifacts, and shadow shifts around text must NEVER be interpreted as vertical borders. A line is ONLY valid if it is an explicit, solid, continuous vertical line extending from a header slot divider.
3. **DO NOT Suffer from Text-Centering Bias:** NEVER assume a cell ends where its text ends or that a cell boundary is defined by text alignment. Text inside a multi-column merged cell is often visually centered over a single sub-column. Boundaries are governed strictly by physical lines, not text placement.
4. **DO NOT Assume Blank Space Equals an Unmerged Cell:** NEVER default to treating empty whitespace as an isolated, standard 1x1 cell if no dividing line exists. No Line = Merged (subject to the 3-column max rule).
5. **DO NOT Overlook Faint Grid Lines in Empty Cells:** NEVER assume that an empty region automatically means merged cells. Check closely for faint or thin vertical grid lines. If vertical dividing lines are [PRESENT] in an empty region, treat each slot as an individual, standard [Empty] cell (e.g., B5, C5, D5 separately).

---

## STEP 5: OUTPUT FORMAT
You must structure your response row-by-row, strictly separated into two phases for each row:

### Phase 1: Line Audit Log
Show the exact line inspection for the row based on STEP 2.

### Phase 2: Spreadsheet Extraction
Provide the final structured list for the row covering all columns A through M:
* **Coordinate / Span:** Exact column letters and row number (e.g., E2:G2 for a 3-slot merge, or B2 for a standard cell).
* **Status:** Standard, Merged (X-column span, max 3), or Sub-divided.
* **Content:** Exact text content (preserving line breaks), or explicitly state [Empty] if no text is present.

---

## EXAMPLE OUTPUT PATTERN

Row 2 (SUN) Line Audit:
- B|C: PRESENT | C|D: PRESENT | D|E: PRESENT
- E|F: MISSING | F|G: MISSING | G|H: PRESENT
- H|I: PRESENT | I|J: PRESENT | J|K: PRESENT
- K|L: PRESENT | L|M: PRESENT

Row 2 Extraction:
* **A2:** Standard | SUN
* **B2:** Standard | [Empty]
* **C2:** Standard | [Empty]
* **D2:** Standard | [Empty]
* **E2:G2:** Merged (3-column span) | CE 400\\nRESERVED\\n(TBA)
* **H2:** Standard | CE 431\\n3A05\\n(MR. ASIF)
* **I2:** Standard | CE 411\\n3A05\\n(DR. MAHMUD)
* **J2:** Standard | CE 415\\n3A05\\n(DR. GALIB)
* **K2:** Standard | [Empty]
* **L2:** Standard | [Empty]
* **M2:** Standard | [Empty]
`.trim();



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenRouter(imageUrl, attempt = 1, maxRetries = 3) {
    const body = {
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: PROMPT },
                    {
                        type: 'image_url',
                        image_url: { url: imageUrl, detail: 'high' },
                    },
                ],
            },
        ],
        max_tokens: 12288,
        temperature: 0,
    };

    try {
        console.log('[OCR] Calling OpenRouter, model:', MODEL);
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://austeswc.com',
                'X-Title': 'ESWC Routine Extractor',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        console.log('[OCR] OpenRouter status:', res.status);
        console.log('[OCR] Full API response:', JSON.stringify(data, null, 2));

        if (!res.ok) {
            const errMsg = data?.error?.message || `HTTP ${res.status}: ${JSON.stringify(data)}`;
            throw new Error(errMsg);
        }

        const choice = data.choices?.[0];
        const content = choice?.message?.content || '';
        const finishReason = choice?.finish_reason;
        const refusal = choice?.message?.refusal;
        console.log('[OCR] Finish reason:', finishReason, '| Content length:', content.length, '| Refusal:', refusal || 'none');

        if (refusal) {
            throw new Error('Model refused to process: ' + refusal);
        }

        if (!content) {
            throw new Error('Empty response from model. Finish reason: ' + (finishReason || 'unknown'));
        }

        return content;
    } catch (err) {
        const isRetryable = err.message?.includes('429') || err.message?.includes('Too Many Requests') || err.message?.includes('rate') || err.message?.includes('quota');
        if (isRetryable && attempt < maxRetries) {
            const delay = attempt * 15000;
            console.warn(`[OCR] Rate limited (attempt ${attempt}/${maxRetries}). Retrying in ${delay / 1000}s...`);
            await sleep(delay);
            return callOpenRouter(imageUrl, attempt + 1, maxRetries);
        }
        throw err;
    }
}

// ─── Visual Schedule Grid Logger ─────────────────────────────────────────────
function logVisualScheduleGrid(gridInfo, classes) {
    const divider = '═'.repeat(70);
    const thinDivider = '─'.repeat(70);

    console.log('\n' + '█'.repeat(70));
    console.log('█  VISUAL SCHEDULE GRID & CELL MERGE ANALYSIS' + ' '.repeat(25) + '█');
    console.log('█'.repeat(70));

    // Grid Info
    console.log('\n┌─────────────────────────────────────────────────────────────────────┐');
    console.log('│  📐 GRID STRUCTURE                                                 │');
    console.log('├─────────────────────────────────────────────────────────────────────┤');
    console.log(`│  Rows (Days):        ${String(gridInfo.total_rows).padEnd(48)}│`);
    console.log(`│  Columns (Slots):    ${String(gridInfo.total_columns).padEnd(48)}│`);
    console.log(`│  Days Detected:      ${String(gridInfo.days_detected?.join(', ')).padEnd(48)}│`);
    console.log(`│  Time Slots:         ${String(gridInfo.time_slots_detected?.length || 0).padEnd(48)}│`);
    console.log(`│  Merged Cells:       ${String(gridInfo.merged_cells_found || 0).padEnd(48)}│`);
    console.log('└─────────────────────────────────────────────────────────────────────┘');

    // Visual Grid Table
    if (gridInfo.days_detected && gridInfo.time_slots_detected) {
        console.log('\n┌─────────────────────────────────────────────────────────────────────┐');
        console.log('│  📊 EXTRACTED SCHEDULE GRID                                        │');
        console.log('├─────────────────────────────────────────────────────────────────────┤');

        const days = gridInfo.days_detected;
        const slots = gridInfo.time_slots_detected;
        const slotWidth = Math.floor(60 / Math.max(slots.length, 1));

        // Header row
        let header = '│ Day      │';
        slots.forEach(s => {
            header += ` ${s.substring(0, slotWidth - 1).padEnd(slotWidth)}│`;
        });
        console.log(header);
        console.log('├──────────┼' + '─'.repeat(slotWidth + 1).repeat(slots.length) + '┤');

        // Data rows
        days.forEach(day => {
            let row = `│ ${day.substring(0, 8).padEnd(8)} │`;
            slots.forEach(slot => {
                const course = classes.find(c =>
                    c.day?.toLowerCase().startsWith(day.toLowerCase().substring(0, 3)) &&
                    c.time === slot
                );
                const cellContent = course ? course.course : '';
                row += ` ${cellContent.substring(0, slotWidth - 1).padEnd(slotWidth)}│`;
            });
            console.log(row);
        });
        console.log('└─────────────────────────────────────────────────────────────────────┘');
    }

    // Merged Cells Report
    const mergedCells = classes.filter(c => c.is_merged || (c.merge_span && c.merge_span > 1));
    if (mergedCells.length > 0) {
        console.log('\n┌─────────────────────────────────────────────────────────────────────┐');
        console.log('│  🔗 CELL MERGES DETECTED                                           │');
        console.log('├─────────────────────────────────────────────────────────────────────┤');
        mergedCells.forEach((cell, idx) => {
            console.log(`│  ${idx + 1}. ${cell.day} ${cell.time} → ${cell.course} (spans ${cell.merge_span} slots)`);
        });
        console.log('└─────────────────────────────────────────────────────────────────────┘');
    }

    // Class Summary
    console.log('\n┌─────────────────────────────────────────────────────────────────────┐');
    console.log('│  📋 CLASS SUMMARY                                                  │');
    console.log('├─────────────────────────────────────────────────────────────────────┤');
    console.log(`│  Total Classes:      ${String(classes.length).padEnd(48)}│`);
    console.log(`│  Unique Courses:     ${String(new Set(classes.map(c => c.course)).size).padEnd(48)}│`);
    console.log(`│  Unique Teachers:    ${String(new Set(classes.filter(c => c.teacher).map(c => c.teacher)).size).padEnd(48)}│`);
    console.log(`│  Days with Classes:  ${String(new Set(classes.map(c => c.day)).size).padEnd(48)}│`);
    console.log('└─────────────────────────────────────────────────────────────────────┘');

    console.log('\n' + '█'.repeat(70) + '\n');
}

export async function extractRoutineFromImage(imageUrl) {
    console.log('\n' + '━'.repeat(70));
    console.log('  🔍 OCR EXTRACTION STARTED');
    console.log('━'.repeat(70));
    console.log('[OCR] Image URL:', imageUrl);

    try {
        console.log('[OCR] Sending image to OpenRouter...');
        console.log('[OCR] Model:', MODEL);
        let text = await callOpenRouter(imageUrl);
        text = text.trim();
        console.log('[OCR] Raw response length:', text.length, 'characters');
        console.log('[OCR] Full AI Response:\n', text);

        // ─── Parse coordinate-based text format ───────────────────────────
        const COLUMNS = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
        const TIME_SLOTS = [
            '8:00-8:50', '8:50-9:40', '9:40-10:30', '10:30-11:20',
            '11:20-12:10', '12:10-13:00', '13:00-13:50', '13:50-14:40',
            '14:40-15:30', '15:30-16:20', '16:20-17:10', '17:10-18:00',
        ];
        const DAY_KEYWORDS = { SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday' };

        function colToTimeSlot(col) {
            const idx = COLUMNS.indexOf(col);
            if (idx <= 0 || idx >= COLUMNS.length) return '';
            return TIME_SLOTS[idx - 1] || '';
        }

        function expandSpan(coord) {
            const cleaned = coord.replace(/\*\*/g, '').trim();
            const parts = cleaned.split(':');
            if (parts.length === 1) return [parts[0]];
            const startIdx = COLUMNS.indexOf(parts[0]);
            const endIdx = COLUMNS.indexOf(parts[1]);
            if (startIdx < 0 || endIdx < 0) return [];
            return COLUMNS.slice(startIdx, endIdx + 1);
        }

        // Try to detect day from Row header — supports formats like:
        //   Row 2 (SUN), Row2 (SUN), Row 2 (Sunday), Row 2 (MONDAY)
        function detectDayFromRow(rowText) {
            const m = rowText.match(/Row\s*\d+\s*\(([^)]+)\)/i);
            if (!m) return null;
            const raw = m[1].trim().toUpperCase();
            if (DAY_KEYWORDS[raw]) return DAY_KEYWORDS[raw];
            // Try first 3 chars match
            for (const [abbr, full] of Object.entries(DAY_KEYWORDS)) {
                if (raw.startsWith(abbr)) return full;
            }
            return null;
        }

        const mapped = [];

        // Split on "Row N" markers (with or without space)
        const rows = text.split(/(?=Row\s*\d+)/gi);

        for (const row of rows) {
            // Extract day from the row header
            const day = detectDayFromRow(row);
            if (!day) continue;

            // Find extraction section — try multiple patterns
            let extractionSection = '';
            const extMatch = row.split(/Extraction\s*:/i)[1]
                || row.split(/Spreadsheet\s*Extraction\s*:/i)[1]
                || row.split(/Phase\s*2\s*:/i)[1];
            if (extMatch) {
                extractionSection = extMatch;
            } else {
                // Fallback: look for lines with cell coordinates directly
                // Pattern: * **X42:** or * **X42:Y42:**
                const coordLines = row.match(/\*\*[A-Z](?::[A-Z])?\d+\*\*:.*/gi);
                if (coordLines) {
                    extractionSection = coordLines.join('\n');
                } else {
                    continue;
                }
            }

            // Parse cell lines: * **COORD:** Status | Content
            // Handles: * **A42:** Standard | [Empty]
            //          * **E2:G2:** Merged (3-column span) | CE 400\nRESERVED
            //          **A42:** Standard | SUN  (without leading *)
            const cellRegex = /\*?\s*\*\*([A-Z](?::[A-Z])?)(\d+)\*\*:\s*(Standard|Merged.*?|Sub-divided)\s*\|\s*`?([^`]*)`?/gi;
            let cellMatch;
            while ((cellMatch = cellRegex.exec(extractionSection)) !== null) {
                const coordRaw = cellMatch[1];
                const rowNum = cellMatch[2];
                const status = cellMatch[3].trim();
                const content = cellMatch[4].trim().replace(/\\n/g, '\n');

                if (content === '[Empty]' || !content) continue;

                const cols = expandSpan(coordRaw);
                const span = cols.length;

                for (const col of cols) {
                    const timeSlot = colToTimeSlot(col);
                    if (!timeSlot) continue;
                    mapped.push({
                        day,
                        time: timeSlot,
                        course: content.split('\n')[0] || '',
                        courseTitle: content.split('\n').slice(1).join(' ').trim() || '',
                        teacher: '',
                        section: '',
                        room: '',
                        is_merged: span > 1,
                        merge_span: span,
                    });
                }
            }
        }

        console.log('[OCR] Parsed slots:', mapped.length, 'slots found');
        console.log('[OCR] Valid slots mapped:', mapped.length);

        // ─── Fallback: try to extract from raw text if primary parser got 0 ─
        if (mapped.length === 0 && text.length > 100) {
            console.log('[OCR] Primary parser got 0 slots, trying fallback extraction...');
            // Look for patterns like: SUN ... B2: [Empty] ... C2: CE 400 ... directly in text
            const fallbackRegex = /(?:SUN|MON|TUE|WED|THU|SUNDAY|MONDAY|TUESDAY|WEDNESDAY|THURSDAY)[\s\S]*?\*\*([A-Z])(\d+)\*\*:\s*(?:Standard|Merged.*?|Sub-divided)\s*\|\s*([^\n*]+)/gi;
            let fbMatch;
            let currentDay = '';
            while ((fbMatch = fallbackRegex.exec(text)) !== null) {
                const dayRaw = fbMatch[0].match(/(SUN|MON|TUE|WED|THU|SUNDAY|MONDAY|TUESDAY|WEDNESDAY|THURSDAY)/i);
                if (dayRaw) {
                    const key = dayRaw[1].substring(0, 3).toUpperCase();
                    currentDay = DAY_KEYWORDS[key] || key;
                }
                const col = fbMatch[1].toUpperCase();
                const content = fbMatch[3].trim();
                if (!content || content === '[Empty]') continue;
                const timeSlot = colToTimeSlot(col);
                if (!timeSlot || !currentDay) continue;
                mapped.push({
                    day: currentDay,
                    time: timeSlot,
                    course: content.split('\\n')[0].split('\n')[0] || '',
                    courseTitle: '',
                    teacher: '',
                    section: '',
                    room: '',
                    is_merged: false,
                    merge_span: 1,
                });
            }
            if (mapped.length > 0) {
                console.log('[OCR] Fallback extracted:', mapped.length, 'slots');
            }
        }

        // ─── Retry with compact prompt if 0 slots found ──────────────────
        if (mapped.length === 0) {
            console.log('[OCR] 0 slots found. Retrying with compact prompt...');
            const COMPACT_PROMPT = `Extract this class schedule into this EXACT text format. For each row output:
Row N (DAY) Extraction:
* **COORD:** Status | Content

Rules:
- Column A=Day, B=8:00, C=8:50, D=9:40, E=10:30, F=11:20, G=12:10, H=13:00, I=13:50, J=14:40, K=15:30, L=16:20, M=17:10
- Use SUN/MON/TUE/WED/THU for days
- Use * **B2:** Standard | CE 400 for single cells
- Use * **E2:G2:** Merged (3-column span) | CE 400 for merged cells
- Use [Empty] for empty cells
- Output ALL rows (SUN through THU), ALL columns A-M
- Do NOT output any audit or explanation, ONLY the extraction lines`;

            try {
                const res2 = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://austeswc.com',
                        'X-Title': 'ESWC Routine Extractor',
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [{ role: 'user', content: [
                            { type: 'text', text: COMPACT_PROMPT },
                            { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
                        ]}],
                        max_tokens: 12288,
                        temperature: 0,
                    }),
                });
                const data2 = await res2.json();
                const text2 = (data2.choices?.[0]?.message?.content || '').trim();
                console.log('[OCR] Retry response length:', text2.length, 'characters');
                if (text2) {
                    console.log('[OCR] Retry AI Response:\n', text2);
                    // Re-parse with same parser
                    const rows2 = text2.split(/(?=Row\s*\d+)/gi);
                    for (const row of rows2) {
                        const day = detectDayFromRow(row);
                        if (!day) continue;
                        let extractionSection = '';
                        const extMatch = row.split(/Extraction\s*:/i)[1];
                        if (extMatch) {
                            extractionSection = extMatch;
                        } else {
                            const coordLines = row.match(/\*\*[A-Z](?::[A-Z])?\d+\*\*:.*/gi);
                            if (coordLines) extractionSection = coordLines.join('\n');
                            else continue;
                        }
                        const cellRegex = /\*?\s*\*\*([A-Z](?::[A-Z])?)(\d+)\*\*:\s*(Standard|Merged.*?|Sub-divided)\s*\|\s*`?([^`]*)`?/gi;
                        let cellMatch;
                        while ((cellMatch = cellRegex.exec(extractionSection)) !== null) {
                            const coordRaw = cellMatch[1];
                            const content = cellMatch[4].trim().replace(/\\n/g, '\n');
                            if (content === '[Empty]' || !content) continue;
                            const cols = expandSpan(coordRaw);
                            const span = cols.length;
                            for (const col of cols) {
                                const timeSlot = colToTimeSlot(col);
                                if (!timeSlot) continue;
                                mapped.push({
                                    day, time: timeSlot,
                                    course: content.split('\n')[0] || '',
                                    courseTitle: content.split('\n').slice(1).join(' ').trim() || '',
                                    teacher: '', section: '', room: '',
                                    is_merged: span > 1, merge_span: span,
                                });
                            }
                        }
                    }
                    console.log('[OCR] Retry parsed slots:', mapped.length);
                }
            } catch (retryErr) {
                console.warn('[OCR] Retry failed:', retryErr.message);
            }
        }

        const gridInfo = {
            total_rows: 5,
            total_columns: 12,
            days_detected: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            time_slots_detected: TIME_SLOTS,
            merged_cells_found: mapped.filter(s => s.is_merged).length,
        };

        logVisualScheduleGrid(gridInfo, mapped);

        return mapped;
    } catch (err) {
        console.error('[OCR] Extraction FAILED:', err.message);
        console.error('[OCR] Error stack:', err.stack);
        throw new Error('Failed to extract routine: ' + err.message);
    }
}

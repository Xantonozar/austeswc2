import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DataCollect from '@/models/DataCollect';
import Routine from '@/models/Routine';
import { extractRoutineFromImage } from '@/lib/gemini';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function formatRoutineSummary(name, slots) {
    const byDay = {};
    for (const s of slots) {
        if (!byDay[s.day]) byDay[s.day] = [];
        byDay[s.day].push(`${s.time} ${s.course}${s.section ? '(' + s.section + ')' : ''}`);
    }
    const days = Object.entries(byDay)
        .map(([day, classes]) => `${day.slice(0, 3)}: ${classes.join(', ')}`)
        .join(' | ');
    return `[Routine Summary] ${name}: ${slots.length} classes | ${days}`;
}

async function isAuthenticated() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    return !!sessionCookie;
}

export async function GET(req) {
    try {
        console.log('[Routine API] GET request received');
        if (!await isAuthenticated()) {
            console.log('[Routine API] GET unauthorized');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const routines = await Routine.find({}).sort({ extractedAt: -1 }).lean();
        console.log('[Routine API] GET success:', routines.length, 'routines found');

        const response = NextResponse.json({ routines });
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    } catch (error) {
        console.error('[Routine API] GET Error:', error.message);
        console.error('[Routine API] GET Stack:', error.stack);
        return NextResponse.json({ error: 'Failed to fetch routines: ' + error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        console.log('[Routine API] POST request received');
        if (!await isAuthenticated()) {
            console.log('[Routine API] POST unauthorized');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        if (body.bulk) {
            console.log('[Routine API] Bulk extraction started');
            const records = await DataCollect.find({}).lean();
            console.log('[Routine API] Total records:', records.length);

            const alreadyExtracted = await Routine.find({}).lean();
            const extractedIds = new Set(alreadyExtracted.map(r => r.dataCollectId.toString()));
            console.log('[Routine API] Already extracted:', extractedIds.size);

            const toProcess = records.filter(r =>
                r.routineImageUrl && !extractedIds.has(r._id.toString())
            );
            console.log('[Routine API] To process:', toProcess.length);

            let successCount = 0;
            let failCount = 0;
            const errors = [];

            for (let i = 0; i < toProcess.length; i++) {
                const record = toProcess[i];
                console.log(`[Routine API] Processing ${i + 1}/${toProcess.length}: ${record.name} (${record.studentId})`);
                try {
                    const slots = await extractRoutineFromImage(record.routineImageUrl);
                    console.log(`[Routine API] Extracted data for ${record.name}:`, JSON.stringify(slots, null, 2));
                    console.log(formatRoutineSummary(record.name, slots));
                    await Routine.findOneAndUpdate(
                        { dataCollectId: record._id },
                        {
                            dataCollectId: record._id,
                            studentId: record.studentId,
                            name: record.name,
                            department: record.department,
                            labGroup: record.labGroup,
                            slots,
                            extractedAt: new Date(),
                        },
                        { upsert: true, new: true }
                    );
                    successCount++;
                    console.log(`[Routine API] Success: ${record.name} - ${slots.length} slots saved to DB`);
                } catch (err) {
                    failCount++;
                    errors.push({ studentId: record.studentId, name: record.name, error: err.message });
                    console.error(`[Routine API] Failed: ${record.name} - ${err.message}`);
                }
            }

            console.log('[Routine API] Bulk complete:', { successCount, failCount });
            return NextResponse.json({
                success: true,
                total: records.length,
                alreadyExtracted: extractedIds.size,
                processed: toProcess.length,
                successCount,
                failCount,
                errors,
            });
        }

        const { dataCollectId } = body;
        if (!dataCollectId) {
            console.log('[Routine API] POST missing dataCollectId');
            return NextResponse.json({ error: 'dataCollectId required' }, { status: 400 });
        }

        console.log('[Routine API] Single extraction for ID:', dataCollectId);
        const record = await DataCollect.findById(dataCollectId).lean();
        if (!record) {
            console.log('[Routine API] Record not found:', dataCollectId);
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        if (!record.routineImageUrl) {
            console.log('[Routine API] No routine image for:', record.name);
            return NextResponse.json({ error: 'No routine image for this record' }, { status: 400 });
        }

        console.log('[Routine API] Extracting routine for:', record.name, record.studentId);
        let slots;
        try {
            slots = await extractRoutineFromImage(record.routineImageUrl);
        } catch (extractErr) {
            console.error('[Routine API] Extraction error for', record.name + ':', extractErr.message);
            return NextResponse.json({ error: extractErr.message }, { status: 422 });
        }
        console.log('[Routine API] Got', slots.length, 'slots for', record.name);
        console.log('[Routine API] Extracted slots data:', JSON.stringify(slots, null, 2));
        console.log(formatRoutineSummary(record.name, slots));

        const routine = await Routine.findOneAndUpdate(
            { dataCollectId: record._id },
            {
                dataCollectId: record._id,
                studentId: record.studentId,
                name: record.name,
                department: record.department,
                labGroup: record.labGroup,
                slots,
                extractedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        console.log('[Routine API] Saved to DB:', record.name, '- ID:', routine._id);
        return NextResponse.json({ success: true, routine });
    } catch (error) {
        console.error('[Routine API] POST Error:', error.message);
        console.error('[Routine API] POST Stack:', error.stack);
        return NextResponse.json({ error: error.message || 'Failed to extract routine' }, { status: 500 });
    }
}

export async function POST(req) {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbz15FHL7eXO7ogrbnDOFLVh5Yno3fzAGk49i-7ErLYvyQEtqrKN-GtNYKga2sQCxeM0Vw/exec";

  try {
    const body = await req.json();

    // 1. Fetch existing data to check duplicate Student ID
    const existingRes = await fetch(SHEET_URL);
    const existingData = await existingRes.json();

    const isDuplicate = existingData.some(row => row.studentId === body.studentId);

    if (isDuplicate) {
      return new Response(JSON.stringify({ error: 'already_exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Submit to Google Sheet
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result?.result === 'success') {
      return new Response(JSON.stringify({ result: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'sheet_submission_failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

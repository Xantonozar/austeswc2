export async function POST(req) {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbwv2GlMBvOv6Vdj33x-L_cqAF7hayOf2iU1nJKrFzm_WT3w1uJ_3HVfcubQPAqEhYCGdw/exec";

  try {
    const body = await req.json();  // now includes imageBase64, imageName, imageType
    console.log('Received submission for student ID:', body.studentId, 'email:', body.email, "phone",body.phone);

    // Check for duplicate entries with proper error handling
    try {
      console.log('Checking for duplicate entries...');
      const existingRes = await fetch(SHEET_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      console.log('Duplicate check response status:', existingRes.status);
      
      if (existingRes.ok) {
        const existingData = await existingRes.json();
        console.log('Existing data type:', typeof existingData, 'isArray:', Array.isArray(existingData));
        
        // Validate that existingData is an array
        if (Array.isArray(existingData)) {
          console.log('Found', existingData.length, 'existing entries');
          const isDuplicate = existingData.some(row => 
            row.studentId === body.studentId || row.email === body.email
          );

          console.log('Duplicate check result:', isDuplicate);
          if (isDuplicate) {
            console.log('Duplicate found - rejecting submission');
            return new Response(JSON.stringify({ error: 'already_exists' }), {
              status: 409,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        } else {
          console.warn('Existing data is not an array:', existingData);
          // Continue with submission if we can't validate duplicates
        }
      } else {
        console.warn('Failed to fetch existing data for duplicate check:', existingRes.status);
        // Continue with submission if duplicate check fails
      }
    } catch (duplicateCheckError) {
      console.error('Error during duplicate check:', duplicateCheckError);
      // Continue with submission if duplicate check fails
    }

    // Submit to Google Sheets
    console.log('Submitting to Google Sheets...');
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(body)
    console.log('Google Sheets response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return new Response(JSON.stringify({ error: 'sheet_submission_failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const result = await response.json();
    console.log('Google Sheets result:', result);

    if (result?.result === 'success') {
      console.log('Submission successful');
      return new Response(JSON.stringify({ result: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Submission failed - unexpected result:', result);
      return new Response(JSON.stringify({ error: 'sheet_submission_failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Submission error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Test endpoint to check Google Apps Script connection
export async function GET() {
  const SHEET_URL = "https://script.google.com/macros/s/AKfycbzJ4_zQzKxrS2SLtN7jqxhjP1iL5ZxgvvWXnBqI_xnskRE4HHkHFHe322H-fjEfS3RB3Q/exec";
  
  try {
    console.log('Testing Google Apps Script connection...');
    const response = await fetch(SHEET_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    console.log('Test response status:', response.status);
    console.log('Test response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test failed:', errorText);
      return new Response(JSON.stringify({ 
        error: 'connection_failed', 
        status: response.status,
        details: errorText 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    console.log('Test data type:', typeof data, 'isArray:', Array.isArray(data));
    console.log('Test data sample:', Array.isArray(data) ? data.slice(0, 2) : data);
    
    return new Response(JSON.stringify({ 
      success: true,
      dataType: typeof data,
      isArray: Array.isArray(data),
      count: Array.isArray(data) ? data.length : 'N/A',
      sample: Array.isArray(data) ? data.slice(0, 2) : data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return new Response(JSON.stringify({ 
      error: 'test_failed', 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
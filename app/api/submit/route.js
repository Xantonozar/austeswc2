
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function POST(req) {
  try {
    console.log("Submit API: Connecting to DB...");
    await connectDB();
    console.log("Submit API: DB Connected");

    const body = await req.json();
    console.log("Submit API: Received body for studentId:", body.studentId);

    // Check for duplicate student ID or email
    const existingMember = await Member.findOne({
      $or: [{ studentId: body.studentId }, { email: body.email }],
    });

    if (existingMember) {
      console.log("Submit API: Duplicate found for", body.studentId);
      return new Response(JSON.stringify({ error: 'already_exists', message: 'Student ID or Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("Submit API: Uploading image to Cloudinary...");
    let imageResult = {};
    if (body.imageBase64) {
      try {
        const { uploadBase64 } = await import('@/lib/cloudinary');
        imageResult = await uploadBase64(body.imageBase64);
        console.log("Submit API: Cloudinary upload success", imageResult.url);
      } catch (uploadError) {
        console.error("Submit API: Cloudinary upload failed", uploadError);
        return new Response(JSON.stringify({ error: 'upload_failed', message: 'Failed to upload image' }), { status: 500 });
      }
    }

    console.log("Submit API: Creating member...");
    // Prepare payload
    const memberData = { ...body, imageUrl: imageResult.url, publicId: imageResult.publicId };

    // Cleanup temporary request fields
    delete memberData.imageBase64;
    delete memberData.imageName;
    delete memberData.imageType;

    const member = await Member.create(memberData);
    console.log("Submit API: Member created successfully", member._id);

    return new Response(JSON.stringify({ result: 'success', member }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Submit API Error:', err);
    // Log full error details including validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error('Validation Errors:', messages);
    }
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

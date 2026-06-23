import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const existingMember = await Member.findOne({
      $or: [{ studentId: body.studentId }, { email: body.email }],
    });

    if (existingMember) {
      return new Response(JSON.stringify({ error: 'already_exists', message: 'Student ID or Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Auto-detect recruitment semester from server time
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    let recruitmentSemester;
    if (month >= 6 && month <= 11) recruitmentSemester = `Fall ${year}`;
    else if (month === 12) recruitmentSemester = `Spring ${year + 1}`;
    else recruitmentSemester = `Spring ${year}`;

    const memberData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      department: body.department,
      yearSemester: body.yearSemester,
      labGroup: body.labGroup,
      studentId: body.studentId,
      bkashId: body.bkashId || '',
      paymentMethod: body.paymentMethod || 'Online',
      reference: body.reference || '',
      imageUrl: body.imageUrl || '',
      publicId: body.publicId || '',
      agreeToTerms: true,
      recruitmentSemester
    };

    const member = await Member.create(memberData);

    return new Response(JSON.stringify({ result: 'success', member }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Submit API Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return new Response(JSON.stringify({ error: 'validation_error', message: messages.join(', ') }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

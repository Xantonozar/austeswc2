import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://meal:BlUntsfgPGpR2SkW@mymongo.rhcri.mongodb.net/austeswc?retryWrites=true&w=majority&appName=MyMongo';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const SENDER = {
    name: process.env.BREVO_SENDER_NAME || 'AUSTESWC',
    email: process.env.BREVO_SENDER_EMAIL || 'zadidsalman@gmail.com'
};

const CompetitionSchema = new mongoose.Schema({
    name: String,
    email: String,
    teamName: String,
    type: String,
    status: String,
}, { strict: false });

const Competition = mongoose.models.Competition || mongoose.model('Competition', CompetitionSchema);

async function sendEmail(toEmail, toName) {
    if (!BREVO_API_KEY) {
        console.log(`[Mock] Email would have been sent to ${toEmail}`);
        return true;
    }
    const subject = 'Your Eco Frame Photo is Live! — Eco Champions 4.0';
    const htmlContent = `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a2e1a; margin:0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #1B4B43; color: #E8F9FF; padding: 28px 20px; text-align: center; border-radius: 12px 12px 0 0; }
                    .content { background-color: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top:none; border-radius: 0 0 12px 12px; }
                    .callout { background: #FFF7ED; border: 1px solid #fed7aa; border-radius: 10px; padding: 16px; margin: 18px 0; }
                    .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #64748b; line-height:1.5; }
                    .sig { margin-top: 24px; font-size: 13px; color: #334155; }
                    .btn { display: inline-block; padding: 13px 28px; background-color: #1B4B43; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 800; margin-top: 14px; }
                    a { color: #1B4B43; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 72px; height: auto; margin-bottom: 12px; background: white; border-radius: 50%; padding: 6px;">
                        <h2 style="margin:0; font-size: 18px;">Your Photo is Live!</h2>
                        <p style="margin:6px 0 0; font-size: 13px; opacity: 0.95;">Eco Champions 4.0 — Eco Frame</p>
                    </div>
                    <div class="content">
                        <p style="margin-top:0;">Dear ${toName || 'Participant'},</p>
                        <p>Great news! Your <strong>Eco Frame</strong> photo has been officially posted on the <strong>AUSTESWC Facebook page</strong> as part of Eco Champions 4.0.</p>
                        <div class="callout">
                            <p style="margin:0; font-size:14px;">We will be posting <strong>2 more photos</strong> soon — stay tuned!</p>
                        </div>
                        <p>Head over to our Facebook page to view your photo and support other participants by liking, commenting, and sharing:</p>
                        <div style="text-align: center;">
                            <a href="https://www.facebook.com/aust.eswc" class="btn">Visit Our Facebook Page</a>
                        </div>
                        <p style="margin-top:18px; font-size:13px; color:#64748b;">Make sure to follow our page so you don't miss the upcoming posts!</p>
                        <div class="sig">
                            <p style="margin:0;">Warm regards,<br><strong>Dewan Rayhan Rahman</strong><br>Organizing Secretary, AUSTESWC<br>Eco Champions 4.0<br>📞 01632729616 | 🌐 austeswc.org</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply.<br>© ${new Date().getFullYear()} AUSTESWC — austeswc.org</p>
                    </div>
                </div>
            </body>
        </html>
    `;
    const payload = { sender: SENDER, to: [{ email: toEmail, name: toName }], subject, htmlContent };
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'api-key': BREVO_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Brevo HTTP error: ${response.status}: ${errData}`);
    }
    return true;
}

async function sendEcoFramePhotoEmails() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB');

        const participants = await Competition.find({ type: 'eco-frame' }).sort({ createdAt: -1 }).lean();
        console.log(`Found ${participants.length} eco-frame participants`);

        if (participants.length === 0) {
            console.log('No eco-frame participants found. Exiting.');
            process.exit(0);
        }

        let sent = 0;
        let failed = 0;
        const failedEmails = [];

        for (const p of participants) {
            const email = p.email;
            const name = p.teamName || p.name || 'Participant';
            if (!email) {
                console.log(`Skipping participant "${name}" — no email found`);
                failed++;
                failedEmails.push(name);
                continue;
            }
            try {
                await sendEmail(email, name);
                sent++;
                console.log(`✓ Sent to ${email} (${name})`);
            } catch (err) {
                failed++;
                failedEmails.push(email);
                console.error(`✗ Failed to send to ${email}: ${err.message}`);
            }
        }

        console.log('\n--- Summary ---');
        console.log(`Total participants: ${participants.length}`);
        console.log(`Sent: ${sent}`);
        console.log(`Failed: ${failed}`);
        if (failedEmails.length > 0) {
            console.log(`Failed emails: ${failedEmails.join(', ')}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

sendEcoFramePhotoEmails();

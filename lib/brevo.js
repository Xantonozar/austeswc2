const SENDER = {
    name: process.env.BREVO_SENDER_NAME || "AUSTESWC",
    email: process.env.BREVO_SENDER_EMAIL || "zadidsalman@gmail.com"
};

const SEGMENT_LABEL = {
    'poster-presentation': 'Poster Presentation',
    'eco-pitch': 'Eco Pitch 180',
    'eco-capture': 'Eco Capture',
    'eco-buzzers': 'Eco Buzzers',
    'green-story': 'Green Story'
};

const formatSegment = (t) => SEGMENT_LABEL[t] || t.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

export const sendCompetitionRegistrationEmail = async (toEmail, toName, competitionType, extra = {}) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Registration email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }
    try {
        const segment = formatSegment(competitionType);
        const teamName = extra.teamName || toName || 'Participant';
        const members = extra.members || [];
        const membersStr = members.length > 0 ? members.map(m => typeof m === 'string' ? m : m.name).filter(Boolean).join(', ') : 'N/A';
        const subject = `Registration Confirmed — Eco Champions 4.0 | ${segment}`;
        const htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a2e1a; margin:0; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #1B4B43; color: #E8F9FF; padding: 28px 20px; text-align: center; border-radius: 12px 12px 0 0; }
                            .content { background-color: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top:none; border-radius: 0 0 12px 12px; }
                            .details { background: #F3F9F1; border: 1px solid #d1e7d1; border-radius: 10px; padding: 16px; margin: 18px 0; }
                            .details p { margin: 6px 0; font-size: 14px; }
                            .details span { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }
                            .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #64748b; line-height:1.5; }
                            a { color: #1B4B43; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 72px; height: auto; margin-bottom: 12px; background: white; border-radius: 50%; padding: 6px;">
                                <h2 style="margin:0; font-size: 18px; letter-spacing: 0.5px;">Eco Champions 4.0</h2>
                                <p style="margin:6px 0 0; font-size: 13px; opacity: 0.9;">AUST Environmental & Social Welfare Club</p>
                            </div>
                            <div class="content">
                                <p style="margin-top:0;">Dear ${toName || teamName},</p>
                                <p>Greetings from <strong>AUST Environmental & Social Welfare Club (AUSTESWC)</strong>!</p>
                                <p>We are pleased to confirm that your registration for the <strong>${segment}</strong> segment of <strong>Eco Champions 4.0</strong> has been successfully received and verified.</p>
                                <div class="details">
                                    <p style="font-weight:800; color:#1B4B43; margin-bottom:10px; font-size:14px;">Registration Details:</p>
                                    <p><span>Team / Participant Name:</span><br><strong>${teamName}</strong></p>
                                    <p><span>Segment:</span><br><strong>${segment}</strong></p>
                                    <p><span>Team Members:</span><br><strong>${membersStr}</strong></p>
                                </div>
                                <p>Please keep this email as proof of your registration. Further instructions regarding submission guidelines, timelines, and round details will be shared with you shortly — or you may refer to the official rulebook available on our website (<a href="https://austeswc.org">austeswc.org</a>) or Facebook page (<a href="https://www.facebook.com/aust.eswc">AUSTESWC</a>).</p>
                                <p>Should you have any queries, feel free to reach out to us through our official contact channels.</p>
                                <p>We look forward to your participation and wish you the very best for the competition!</p>
                                <br/>
                                <p style="margin-bottom:0;">Warm regards,<br><strong>Team AUST Environmental & Social Welfare Club</strong><br><span style="font-size:13px; color:#64748b;">Eco Champions 4.0</span></p>
                            </div>
                            <div class="footer">
                                <p>This is an automated message. Please do not reply.<br>© ${new Date().getFullYear()} AUSTESWC — austeswc.org</p>
                            </div>
                        </div>
                    </body>
                </html>
            `;
        const recipientEmails = new Set();
        recipientEmails.add(toEmail);
        members.forEach(m => { if (m && m.email) recipientEmails.add(m.email.trim().toLowerCase()); });
        const to = [...recipientEmails].map(email => ({ email }));
        const payload = { sender: SENDER, to, subject, htmlContent };
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errData = await response.text();
            console.error("Brevo API Error:", response.status, errData);
            throw new Error(`Brevo HTTP error: ${response.status}`);
        }
        console.log('Brevo registration email sent to', to.length, 'recipients');
        return true;
    } catch (error) {
        console.error('Error sending email via Brevo REST API:', error.message);
        return false;
    }
};

export const sendSelectionEmail = async (toEmail, toName, competitionType, extra = {}) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Selection email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }
    try {
        const segment = formatSegment(competitionType);
        const teamName = extra.teamName || toName || 'Participant';
        const amount = extra.amount || (competitionType === 'poster-presentation' ? '499' : competitionType === 'eco-pitch' ? '700' : competitionType === 'eco-buzzers' ? '100' : '499');
        const deadline = extra.deadline || 'as per rulebook';
        const subject = `Congratulations! You're Eligible for Round 2 — Eco Champions 4.0 | ${segment}`;
        const htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a2e1a; margin:0; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #1B4B43; color: #E8F9FF; padding: 28px 20px; text-align: center; border-radius: 12px 12px 0 0; }
                            .content { background-color: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top:none; border-radius: 0 0 12px 12px; }
                            .callout { background: #FFF7ED; border: 1px solid #fed7aa; border-radius: 10px; padding: 16px; margin: 18px 0; }
                            .steps { background: #F3F9F1; border: 1px solid #d1e7d1; border-radius: 10px; padding: 16px; margin: 18px 0; }
                            .steps li { margin: 8px 0; font-size: 14px; }
                            .btn { display: inline-block; padding: 13px 28px; background-color: #1B4B43; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 800; margin-top: 14px; }
                            .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #64748b; line-height:1.5; }
                            .sig { margin-top: 24px; font-size: 13px; color: #334155; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 72px; height: auto; margin-bottom: 12px; background: white; border-radius: 50%; padding: 6px;">
                                <h2 style="margin:0; font-size: 18px;">Congratulations! 🎉</h2>
                                <p style="margin:6px 0 0; font-size: 13px; opacity: 0.95;">You've qualified for Round 2 — ${segment}</p>
                            </div>
                            <div class="content">
                                <p style="margin-top:0;">Dear ${toName || teamName},</p>
                                <p>Greetings from <strong>AUST Environmental & Social Welfare Club (AUSTESWC)</strong>!</p>
                                <p>Congratulations! Based on the evaluation of Round 1, we are pleased to inform you that your team, <strong>${teamName}</strong>, has successfully qualified for <strong>Round 2</strong> of the <strong>${segment}</strong> segment under <strong>Eco Champions 4.0</strong>.</p>
                                <div class="steps">
                                    <p style="font-weight:800; color:#1B4B43; margin:0 0 10px; font-size:14px;">Next Steps — Registration & Fee Payment:</p>
                                    <ul style="margin:0; padding-left: 18px;">
                                        <li><strong>Round 2 Registration Fee:</strong> BDT ${amount} per team</li>
                                        <li><strong>Payment Method:</strong> bKash to the designated payment number (as provided in the rulebook / QR code)</li>
                                        <li>After payment, submit your <strong>Transaction ID (TrxID)</strong> along with your team details through the official Round 2 registration form.</li>
                                        <li><strong>Payment Deadline:</strong> ${deadline}</li>
                                    </ul>
                                </div>
                                <div style="text-align: center;">
                                    <a href="https://austeswc.org/competetion/check-status" class="btn">Complete Round 2 Payment</a>
                                    <p style="font-size:11px; color:#64748b; margin-top:8px;">or visit austeswc.org → Check Status</p>
                                </div>
                                <div class="callout">
                                    <p style="margin:0; font-size:13px;">Kindly ensure all required materials (as specified in the rulebook for ${segment}) are prepared and ready in advance of Round 2.</p>
                                    <p style="margin:8px 0 0; font-size:13px; color:#9a3412;"><strong>Failure to complete registration and payment within the deadline may result in forfeiture of your slot</strong>, as per the disqualification guidelines.</p>
                                </div>
                                <p>For any assistance, please don't hesitate to contact us.</p>
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
        const recipientEmails = new Set();
        recipientEmails.add(toEmail);
        (extra.members || []).forEach(m => { if (m && m.email) recipientEmails.add(m.email.trim().toLowerCase()); });
        const to = [...recipientEmails].map(email => ({ email }));
        const payload = { sender: SENDER, to, subject, htmlContent };
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(JSON.stringify(await response.json()));
        console.log('Selection email sent to', to.length, 'recipients');
        return true;
    } catch (error) {
        console.error('Error sending selection email:', error);
        return false;
    }
};

export const sendPaymentSuccessEmail = async (toEmail, toName, competitionType, round = 2) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Payment confirmation email for ${competitionType} (Round ${round}) would have been sent to ${toEmail}`);
        return true;
    }

    try {
        const roundNum = parseInt(round);
        const payload = {
            sender: SENDER,
            to: [{ email: toEmail, name: toName }],
            subject: `Payment Confirmed - ${competitionType.replace('-', ' ').toUpperCase()} (Round ${roundNum})`,
            htmlContent: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                            .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
                            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 80px; height: auto; margin-bottom: 15px;">
                                <h2>Payment Received!</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${toName || 'Participant'},</p>
                                <p>We have successfully received your payment for <strong>${competitionType.replace('-', ' ').toUpperCase()}</strong> Round ${roundNum}.</p>
                                ${roundNum === 2
                    ? '<p>Your spot is now officially confirmed. Get ready for the final event!</p>'
                    : '<p>Your payment has been verified. We will contact you soon with further details.</p>'}
                                <p>We look forward to seeing you there.</p>
                                <br/>
                                <p>Best regards,</p>
                                <p><strong>AUST Environmental & Social Welfare Club</strong></p>
                            </div>
                            <div class="footer">
                                <p>This is an automated message. Please do not reply.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(JSON.stringify(await response.json()));
        console.log('Payment success email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending payment success email:', error);
        return false;
    }
};
export const sendPaymentRejectionEmail = async (toEmail, toName, competitionType) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Payment rejection email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }

    try {
        const payload = {
            sender: SENDER,
            to: [{ email: toEmail, name: toName }],
            subject: `Action Required: Payment Rejected - ${competitionType.replace('-', ' ').toUpperCase()}`,
            htmlContent: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #e11d48; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                            .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
                            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
                            .btn { display: inline-block; padding: 12px 24px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 80px; height: auto; margin-bottom: 15px;">
                                <h2>Payment Verification Failed</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${toName || 'Participant'},</p>
                                <p>We are writing to inform you that your payment verification for <strong>${competitionType.replace('-', ' ').toUpperCase()}</strong> has been <strong>rejected</strong>.</p>
                                <p>This usually happens due to an incorrect Transaction ID or reference. Please re-check your payment details and submit the correct Transaction ID via the portal below:</p>
                                <div style="text-align: center;">
                                    <a href="https://austeswc.org/competetion/check-status" class="btn">Re-submit Transaction ID</a>
                                </div>
                                <p style="margin-top: 30px;">If you have already made the payment, please ensure you are entering the correct 8-10 digit Transaction ID provided by bKash/Nagad.</p>
                                <p>Best regards,</p>
                                <p><strong>AUST Environmental & Social Welfare Club</strong></p>
                            </div>
                            <div class="footer">
                                <p>This is an automated message. Please do not reply.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(JSON.stringify(await response.json()));
        console.log('Payment rejection email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending payment rejection email:', error);
        return false;
    }
};

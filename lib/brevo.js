export const sendCompetitionRegistrationEmail = async (toEmail, toName, competitionType) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Registration email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }

    try {
        const payload = {
            sender: { name: "AUSTESWC", email: "admin@austeswc.org" }, // Change to verified sender
            to: [{ email: toEmail, name: toName }],
            subject: `Registration Successful - ${competitionType.replace('-', ' ').toUpperCase()}`,
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
                                <h2>ESWC Competition Registration</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${toName || 'Participant'},</p>
                                <p>Thank you for registering for <strong>${competitionType.replace('-', ' ').toUpperCase()}</strong>.</p>
                                <p>We have successfully received your submission. Our team will review your entry and get back to you with further instructions if you are selected for the next round.</p>
                                <p>Stay tuned for updates!</p>
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
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(JSON.stringify(errData));
        }

        console.log('Brevo email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email via Brevo REST API:', error);
        return false;
    }
};

export const sendSelectionEmail = async (toEmail, toName, competitionType) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Selection email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }

    try {
        const payload = {
            sender: { name: "AUSTESWC", email: "admin@austeswc.org" },
            to: [{ email: toEmail, name: toName }],
            subject: `Congratulations! Selected for Round 2 - ${competitionType.replace('-', ' ').toUpperCase()}`,
            htmlContent: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #1B4B43; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                            .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
                            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
                            .btn { display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://austeswc.org/eswclogo.png" alt="AUSTESWC Logo" style="width: 80px; height: auto; margin-bottom: 15px;">
                                <h2>ESWC Competition Update</h2>
                            </div>
                            <div class="content">
                                <p>Dear ${toName || 'Participant'},</p>
                                <p>Congratulations! We are thrilled to inform you that your entry for <strong>${competitionType.replace('-', ' ').toUpperCase()}</strong> has been <strong>selected for Round 2!</strong></p>
                                <p>To confirm your participation, please check your status and complete the Round 2 payment by clicking the button below:</p>
                                <div style="text-align: center;">
                                    <a href="https://austeswc.com/competetion/check-status" class="btn">Check Status & Pay</a>
                                </div>
                                <p style="margin-top: 30px;">If you have any questions, feel free to contact us.</p>
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
        console.log('Selection email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending selection email:', error);
        return false;
    }
};

export const sendPaymentSuccessEmail = async (toEmail, toName, competitionType) => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Mock Email] Payment confirmation email for ${competitionType} would have been sent to ${toEmail}`);
        return true;
    }

    try {
        const payload = {
            sender: { name: "AUSTESWC", email: "admin@austeswc.org" },
            to: [{ email: toEmail, name: toName }],
            subject: `Payment Confirmed - ${competitionType.replace('-', ' ').toUpperCase()}`,
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
                                <p>We have successfully received your payment for <strong>${competitionType.replace('-', ' ').toUpperCase()}</strong> Round 2.</p>
                                <p>Your spot is now officially confirmed. Get ready for the final event!</p>
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

import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html }) {
  // Create reusable transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // If HTML is not provided, generate a simple HTML version from the text
  if (!html && text) {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">${subject}</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #666;">
          ${text.replace(/\n/g, '<br>')}
        </p>
        <div style="margin-top: 30px; padding: 15px 0; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #999; margin: 0;">
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `;
  }

  // Send mail with defined transport object
  return transporter.sendMail({
    from: `"DecorMind AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

// Specialized function for sending credit notification
export async function sendCreditNotification({ to, credits }) {
  const subject = "You've Received Free Credits on DecorMind AI!";
  const text = `You've received ${credits} new credits on DecorMind AI. Enjoy designing!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">You've Received Free Credits!</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #666;">
        Good news! An administrator has added <strong>${credits} credits</strong> to your account.
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #666;">
        Log in to your DecorMind AI account to start designing with your new credits.
      </p>
      <div style="margin-top: 30px; padding: 15px 0; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #999; margin: 0;">
          This is an automated message, please do not reply.
        </p>
      </div>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
} 
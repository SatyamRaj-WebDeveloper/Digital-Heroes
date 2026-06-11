
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const dispatchWinnerAlertEmail = async (userEmail, userName, prizeAmount, matchTier) => {
  const messageConfig = {
    from: `"Digital Heroes Platform" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: '🚨 Winner Alert: Your Performance Metrics Match!',
    html: `
      <div style="font-family: sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 16px;">
        <h2 style="color: #f59e0b;">Congratulations, ${userName}!</h2>
        <p style="font-size: 14px; color: #94a3b8;">Your rolling golf performance records successfully matched a monthly award cycle draw tier[cite: 2].</p>
        <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1e293b;">
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Match Tier Achieved</span>
          <div style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 10px;">${matchTier}-Number Configuration Match[cite: 2]</div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Allocated Payout Balance</span>
          <div style="font-size: 24px; font-weight: 900; color: #f59e0b;">$${prizeAmount}</div>
        </div>
        <p style="font-size: 11px; color: #475569;">Log into your user dashboard profile grid to upload your platform validation screenshot and clear this payout to your bank[cite: 2].</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(messageConfig);
    console.log(`System notifications successfully transmitted to recipient context: ${userEmail}`);
  } catch (err) {
    console.error(`Mailer routing fault encountered: ${err.message}`);
  }
};
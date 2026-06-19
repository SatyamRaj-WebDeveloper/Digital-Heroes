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

// 1. ADDED: System Welcome Notification (PRD: System Updates)
export const dispatchWelcomeEmail = async (userEmail, userName) => {
  const messageConfig = {
    from: `"Digital Heroes" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: 'Welcome to Digital Heroes | Account Secured',
    html: `
      <div style="font-family: sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 16px;">
        <h2 style="color: #f59e0b;">DIGITAL<span style="color:#fff;">HEROES.</span></h2>
        <p style="font-size: 15px;">Hi ${userName},</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Your full-stack profile has been securely provisioned. You can now log into your performance grid, sync your rolling metrics, and authorize impact distributions for your chosen charity.</p>
        <br />
        <p style="font-size: 11px; color: #475569;">&copy; 2026 Digital Heroes Infrastructure Platform. Issued for Selection Process Evaluation.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(messageConfig);
    console.log(`[SMTP Success] Registration welcome email sent to: ${userEmail}`);
  } catch (err) {
    console.error(`[SMTP Error] Registration mailer fault: ${err.message}`);
  }
};

// 2. EXISTING: Winner Alert Notification (PRD: Winner Alerts)
export const dispatchWinnerAlertEmail = async (userEmail, userName, prizeAmount, matchTier) => {
  const messageConfig = {
    from: `"Digital Heroes Platform" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: '🚨 Winner Alert: Your Performance Metrics Match!',
    html: `
      <div style="font-family: sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 16px;">
        <h2 style="color: #f59e0b;">Congratulations, ${userName}!</h2>
        <p style="font-size: 14px; color: #94a3b8;">Your rolling golf performance records successfully matched a monthly award cycle draw tier.</p>
        <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1e293b;">
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Match Tier Achieved</span>
          <div style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 10px;">${matchTier}-Number Configuration Match</div>
          <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Allocated Payout Balance</span>
          <div style="font-size: 24px; font-weight: 900; color: #f59e0b;">$${prizeAmount}</div>
        </div>
        <p style="font-size: 11px; color: #475569;">Log into your user dashboard profile grid to upload your platform validation screenshot and clear this payout to your bank.</p>
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

// 3. ADDED: Draw Results Announcement (PRD: Draw Results)
export const dispatchDrawResultsEmail = async (userEmail, drawMonth) => {
  const messageConfig = {
    from: `"Digital Heroes" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Digital Heroes: ${drawMonth} Draw Results Are Live!`,
    html: `
      <div style="font-family: sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 16px;">
        <h3 style="color: #f59e0b; font-size: 18px; margin-bottom: 4px;">Monthly Cycle Compiled</h3>
        <p style="font-size: 13px; color: #64748b; margin-top: 0;">${drawMonth} Configuration Metrics</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">The administrative panel has officially executed and published the active pool draw parameters for this cycle.</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Head over to your personal tracking metrics terminal to check your match eligibility status.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(messageConfig);
  } catch (err) {
    console.error(`[SMTP Error] Draw result compilation mailer fault: ${err.message}`);
  }
};
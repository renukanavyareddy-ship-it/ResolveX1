const nodemailer = require('nodemailer');

let transporter = null;

// Initialize transporter
function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development / fallback logger transporter
    transporter = {
      sendMail: async (options) => {
        console.log(`\n================== [EMAIL DISPATCHED] ==================`);
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Summary: ${options.text || 'HTML Email Body Sent'}`);
        console.log(`========================================================\n`);
        return { messageId: `mock-${Date.now()}` };
      }
    };
  }
  return transporter;
}

/**
 * Send email when a complaint is registered
 */
async function sendComplaintRegisteredEmail(user, complaint) {
  try {
    const mailer = getTransporter();
    const trackingUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/track?id=${complaint.trackingId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 16px; border-radius: 6px; text-align: center; color: white;">
          <h2 style="margin: 0;">ResolveX Smart Grievance Redressal</h2>
          <p style="margin: 4px 0 0 0; opacity: 0.9;">Complaint Registered Successfully</p>
        </div>
        <div style="padding: 20px 0;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your complaint has been successfully registered in our system and assigned for review.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #2563eb; font-weight: bold;">${complaint.trackingId}</span></p>
            <p style="margin: 4px 0;"><strong>Title:</strong> ${complaint.title}</p>
            <p style="margin: 4px 0;"><strong>Category:</strong> ${complaint.category}</p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> ${complaint.priority}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${complaint.status}</p>
          </div>

          <p>You can track the real-time progress of your complaint at any time:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${trackingUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Track Your Complaint</a>
          </div>
          <p style="color: #64748b; font-size: 13px;">If you have any further questions, simply log in to your ResolveX dashboard.</p>
        </div>
      </div>
    `;

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || '"ResolveX Support" <noreply@resolvex.gov>',
      to: user.email,
      subject: `[ResolveX] Complaint Registered: ${complaint.trackingId}`,
      text: `Your complaint "${complaint.title}" has been registered. Tracking ID: ${complaint.trackingId}`,
      html
    });
  } catch (err) {
    console.error('Email sending error:', err.message);
  }
}

/**
 * Send email when status changes
 */
async function sendStatusUpdateEmail(user, complaint, oldStatus, newStatus, adminMessage = '') {
  try {
    const mailer = getTransporter();
    const trackingUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/track?id=${complaint.trackingId}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 16px; border-radius: 6px; text-align: center; color: white;">
          <h2 style="margin: 0;">Complaint Status Updated</h2>
          <p style="margin: 4px 0 0 0; opacity: 0.9;">Tracking ID: ${complaint.trackingId}</p>
        </div>
        <div style="padding: 20px 0;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>There is an update on your complaint titled: "<strong>${complaint.title}</strong>".</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin: 16px 0; border-radius: 6px;">
            <p style="margin: 4px 0;"><strong>Previous Status:</strong> <span style="text-decoration: line-through; color: #94a3b8;">${oldStatus}</span></p>
            <p style="margin: 4px 0;"><strong>New Status:</strong> <span style="color: #059669; font-weight: bold; font-size: 15px;">${newStatus}</span></p>
            ${complaint.department ? `<p style="margin: 4px 0;"><strong>Assigned Department:</strong> ${complaint.department}</p>` : ''}
            ${adminMessage ? `<div style="margin-top: 10px; padding: 10px; background-color: #ecfdf5; border-left: 3px solid #10b981; border-radius: 4px;"><strong>Admin Remark:</strong> ${adminMessage}</div>` : ''}
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${trackingUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Complaint Progress</a>
          </div>
        </div>
      </div>
    `;

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || '"ResolveX Support" <noreply@resolvex.gov>',
      to: user.email,
      subject: `[ResolveX Update] Status changed to ${newStatus} for ${complaint.trackingId}`,
      text: `Status for complaint ${complaint.trackingId} changed from ${oldStatus} to ${newStatus}.`,
      html
    });
  } catch (err) {
    console.error('Email sending error:', err.message);
  }
}

module.exports = {
  sendComplaintRegisteredEmail,
  sendStatusUpdateEmail
};

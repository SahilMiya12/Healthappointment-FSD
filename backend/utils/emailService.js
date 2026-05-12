const nodemailer = require('nodemailer');

const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';

let transporter = null;

if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Send appointment confirmation email
const sendAppointmentConfirmation = async (patientEmail, patientName, doctorName, date, time, appointmentId) => {
  if (!EMAIL_ENABLED) {
    console.log(`📧 [EMAIL DISABLED] Would send confirmation email to: ${patientEmail}`);
    return;
  }
  
  try {
    const mailOptions = {
      from: `"Healthcare System" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Appointment Confirmation - Healthcare System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: #2A5C7F; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2>Healthcare System</h2>
            <p>Appointment Confirmed</p>
          </div>
          <div style="padding: 20px;">
            <h3>Dear ${patientName},</h3>
            <p>Your appointment has been successfully booked.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Dr. ${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${new Date(date).toLocaleDateString()}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${time}<tr>
                </tr>
              </table>
            <p><strong>Please arrive 10 minutes before your appointment time.</strong></p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to:', patientEmail);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

// Send status update email
const sendAppointmentStatusUpdate = async (patientEmail, patientName, doctorName, date, time, status) => {
  if (!EMAIL_ENABLED) {
    console.log(`📧 [EMAIL DISABLED] Would send status update to: ${patientEmail} - Status: ${status}`);
    return;
  }
  
  try {
    const statusText = status === 'confirmed' ? 'Confirmed' : 'Cancelled';
    const statusColor = status === 'confirmed' ? '#27AE60' : '#E74C3C';
    
    const mailOptions = {
      from: `"Healthcare System" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: `Appointment ${statusText} - Healthcare System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: ${statusColor}; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2>Healthcare System</h2>
            <p>Appointment ${statusText}</p>
          </div>
          <div style="padding: 20px;">
            <h3>Dear ${patientName},</h3>
            <p>Your appointment has been <strong>${statusText}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Dr. ${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${new Date(date).toLocaleDateString()}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
                </tr>
              </table>
            ${status === 'cancelled' ? '<p>You can book another appointment from your dashboard.</p>' : ''}
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent to:', patientEmail);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

// Send appointment reminder
const sendAppointmentReminder = async (patientEmail, patientName, doctorName, date, time) => {
  if (!EMAIL_ENABLED) {
    console.log(`📧 [EMAIL DISABLED] Would send reminder to: ${patientEmail}`);
    return;
  }
  
  try {
    const mailOptions = {
      from: `"Healthcare System" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Appointment Reminder - Tomorrow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: #3498DB; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2>Healthcare System</h2>
            <p>Appointment Reminder</p>
          </div>
          <div style="padding: 20px;">
            <h3>Dear ${patientName},</h3>
            <p>This is a reminder that you have an appointment <strong>tomorrow</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">Dr. ${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${new Date(date).toLocaleDateString()}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
                </tr>
              </table>
            <p>Please arrive on time.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Reminder email sent to:', patientEmail);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentStatusUpdate,
  sendAppointmentReminder,
};
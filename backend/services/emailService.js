const nodemailer = require('nodemailer');

const sendDocumentNotification = async (userEmail, action, documentName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const messages = {
      upload: {
        text: `Your document "${documentName}" has been successfully uploaded.`,
        html: `<p>Your document <strong>${documentName}</strong> has been successfully <strong>uploaded</strong>.</p>`
      },
      delete: {
        text: `Your document "${documentName}" has been deleted from your vault.`,
        html: `<p>Your document <strong>${documentName}</strong> has been <strong>deleted</strong> from your vault.</p>`
      }
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Document ${action} Notification`,
      text: messages[action].text,
      html: messages[action].html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email: ', error.response);
    throw new Error('Failed to send email');
  }
};

const sendVerificationCode = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000);

  await trasnsporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Passwor Reset Code',
    html: `
      <h2>Your Password Reset Code</h2>
      <p>Your verification code: <strong>${code}</strong></p>
      <p>Expires in 10 minutes</p>
      `
  });

  return code;
};

module.exports = { sendDocumentNotification };
module.exports = { sendVerificationCode };

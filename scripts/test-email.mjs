import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.spacemail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: 'support@kjautos.online',
    pass: 'Marc1234?',
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log("Testing Spacemail SMTP connection...");

  try {
    await transporter.verify();
    console.log("SMTP Connection Verified Successfully!");

    const info = await transporter.sendMail({
      from: '"KJ Autos Support" <support@kjautos.online>',
      to: 'phils7872@gmail.com',
      subject: 'KJ Autos Order Confirmation Test',
      text: 'This is a test email sent via KJ Autos Spacemail SMTP server to verify configuration.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0d47a1;">KJ Autos Order Notification</h2>
          <p>This is a test notification confirming that Spacemail SMTP for <strong>support@kjautos.online</strong> is fully configured and operational.</p>
          <p>Thank you!</p>
        </div>
      `,
    });

    console.log("Message sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
  }
}

main();

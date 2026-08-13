import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || "mail.spacemail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "support@kjautos.online";
const SMTP_PASS = process.env.SMTP_PASS || "Marc1234?";

const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    if (res && res.status) return res.status(405).json({ error: 'Method Not Allowed' });
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload.total || 0);

    const itemsHtml = (payload.items || []).map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${item.vehicle_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
          ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((item.unit_price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `).join('');

    // 1. Admin Email HTML
    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="background-color: #0b192c; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase;">New Vehicle Order Received</h1>
            <p style="color: #60a5fa; margin: 6px 0 0 0; font-size: 14px; font-weight: bold;">Order #${payload.orderNumber}</p>
          </div>
          
          <div style="padding: 24px; color: #334155;">
            <h3 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Customer Information</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${payload.fullName}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${payload.email}" style="color: #2563eb;">${payload.email}</a></p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${payload.phone}</p>
            <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${payload.address}, ${payload.city}, ${payload.state} ${payload.postcode}, ${payload.country}</p>
            <p style="margin: 4px 0;"><strong>Payment Method:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${String(payload.paymentMethod || '').toUpperCase()}</span></p>
            ${payload.notes ? `<p style="margin: 8px 0; background: #fffbeb; padding: 10px; border-left: 4px solid #f59e0b;"><strong>Order Notes:</strong> ${payload.notes}</p>` : ''}

            <h3 style="color: #0f172a; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background: #f8fafc; text-align: left; font-size: 12px; color: #64748b;">
                  <th style="padding: 8px;">Vehicle</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 16px; background: #0f172a; color: #ffffff; border-radius: 6px; text-align: right;">
              <span style="font-size: 14px; text-transform: uppercase;">Total Order Amount:</span>
              <strong style="font-size: 22px; color: #38bdf8; display: block;">${formattedTotal}</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    // 2. Customer Email HTML
    const customerHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background-color: #0d47a1; padding: 28px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">KJ AUTOS</h1>
            <p style="color: #93c5fd; margin: 4px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Bank Repossessed Vehicles — California</p>
          </div>

          <div style="padding: 28px; color: #334155;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Thank you for your order, ${payload.fullName}!</h2>
            <p style="line-height: 1.6;">We have successfully received your order <strong>#${payload.orderNumber}</strong>. A California liquidation advisor will review your vehicle selection and contact you shortly with final delivery confirmation and payment instructions.</p>

            <div style="background: #f1f5f9; border-radius: 6px; padding: 16px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #0f172a; text-transform: uppercase; font-size: 12px;">Order Summary</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="margin-top: 14px; text-align: right; font-size: 16px; font-weight: bold; color: #0f172a;">
                Total: <span style="color: #0284c7;">${formattedTotal}</span>
              </div>
            </div>

            <p style="line-height: 1.6;">If you have any questions in the meantime, simply reply to this email or contact support at <a href="mailto:support@kjautos.online" style="color: #2563eb;">support@kjautos.online</a>.</p>

            <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
              &copy; ${new Date().getFullYear()} KJ Autos California. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    `;

    // Send email to admin
    await mailTransporter.sendMail({
      from: `"KJ Autos Order System" <${SMTP_USER}>`,
      to: "support@kjautos.online",
      subject: `🚨 New Order #${payload.orderNumber} - ${payload.fullName} (${formattedTotal})`,
      html: adminHtml,
    });

    // Send email to customer if customer email provided
    if (payload.email) {
      await mailTransporter.sendMail({
        from: `"KJ Autos California" <${SMTP_USER}>`,
        to: payload.email,
        subject: `Order Confirmation #${payload.orderNumber} - KJ Autos`,
        html: customerHtml,
      });
    }

    if (res && res.status) {
      return res.status(200).json({ ok: true, message: "Emails sent successfully" });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (error) {
    console.error("Vercel Email Error:", error);
    if (res && res.status) {
      return res.status(500).json({ error: error.message || "Email failure" });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

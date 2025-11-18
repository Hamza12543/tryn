import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL || '"Shop Admin" <no-reply@shop.com>',
      to,
      subject,
      html,
      text,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    // Don’t crash API if mail fails
  }
}

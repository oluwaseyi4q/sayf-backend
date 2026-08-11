const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    // No SMTP configured — fall back to a no-op transporter that just logs.
    transporter = {
      sendMail: async (opts) => {
        console.log("[mailer] SMTP not configured, skipping send:", opts.subject, "->", opts.to);
        return { messageId: "noop" };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  return t.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@sayftechnology.com",
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };

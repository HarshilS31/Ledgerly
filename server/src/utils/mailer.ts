import nodemailer from "nodemailer"
const getTransporter = () => (
    nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:process.env.SMTP_PORT==="465",
        auth:{user :process.env.SMTP_USER,pass:process.env.SMTP_PASS},
    })
)
export const sendResetEmail = (to: string, link: string) =>
  getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Reset your Ledgerly password",
    text: `Hi,\n\nWe got a request to reset your Ledgerly password. Use this link within 15 minutes:\n${link}\n\nIf you didn't ask for this, you can ignore this email.\n\nLedgerly`,
    html: `<p>Hi,</p><p>We got a request to reset your Ledgerly password. Use this link within 15 minutes:</p><p><a href="${link}">Reset my password</a></p><p>If you didn't ask for this, you can ignore this email.</p><p>Ledgerly</p>`,
  });
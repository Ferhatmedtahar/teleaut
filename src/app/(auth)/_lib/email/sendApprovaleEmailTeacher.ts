import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT ?? "587", 10),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const verificationUrl = `http://${
      process.env.FRONTEND_URL ?? "localhost:3000"
    }/sign-up/verify?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Cognacia",
      html: `
      <h1>Welcome to Cognacia</h1>
      <p>Hey there, welcome to Cognacia!</p>
      <p>We are very excited to see you join our teacher community!</p>
        <h2>Email Verification</h2>
        <p>To access your dashboard and start your teaching journey please confirm your email by clicking the button below.</p>
        <a href="${verificationUrl}">Confirm Email Address</a>
        <p>If you have any questions, make sure to contact Administrators. We are always happy to help you out!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

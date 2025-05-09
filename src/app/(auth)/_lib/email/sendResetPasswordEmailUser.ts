import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, token: string) {
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
    }/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Cognacia",
      html: `
      <h1>Reset Password</h1>
      <p>Hey there,</p>
      <p>You have requested to reset your password on Cognacia. If you didn't make this request, please ignore this email.</p>
      <p>If this is you, please click the button below to reset your password.</p>
        <a href="${verificationUrl}">Reset Your Password</a>
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

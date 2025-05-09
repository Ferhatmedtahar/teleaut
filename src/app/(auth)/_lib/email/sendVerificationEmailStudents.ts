import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  userId: string,
  email: string,
  token: string
): Promise<{ emailSent: boolean; message: string }> {
  try {
    const supabase = await createClient();

    const { data: emailsLastHour, error } = await supabase
      .from("email_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "reset_password")
      .gte("sent_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Failed to check email logs:", error);
      return { message: "Internal error.", emailSent: false };
    }
    if ((emailsLastHour?.length ?? 0) >= 3) {
      return {
        message:
          "Rate limit exceeded. You can request up to 3 reset emails per hour.",
        emailSent: false,
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT ?? "587", 10),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const verificationUrl = `http://localhost:3000/sign-up/verify?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Cognacia",
      html: `
      <h1>Welcome to Cognacia</h1>
      <p>Hey there, welcome to Cognacia!</p>
      <p>We are very excited to see you join us!</p>
        <h2>Email Verification</h2>
        <p>To access your dashboard and start your learning journey please confirm your email by clicking the button below.</p>
        <a  style="background:#355869;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;"href="${verificationUrl}">Confirm Email Address</a>
        <p>If you have any questions, make sure to contact us. We are always happy to help you out!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    if (info.messageId) {
      await supabase
        .from("users")
        .update({ verification_status: VERIFICATION_STATUS.EMAIL_SENT })
        .eq("id", userId);

      await supabase.from("email_logs").insert({
        user_id: userId,
        type: "verification",
        sent_at: new Date(),
      });
    }

    return { message: "Email sent successfully.", emailSent: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { message: "Internal error.", emailSent: false };
  }
}

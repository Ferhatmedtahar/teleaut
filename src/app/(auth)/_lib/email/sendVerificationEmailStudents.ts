import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  userId: string,
  email: string,
  token: string
): Promise<{ emailSent: boolean; message: string }> {
  try {
    console.log("Starting email send process for:", email);

    const supabase = await createClient();

    const { data: emailsLastHour, error } = await supabase
      .from("email_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "verification")
      .gte("sent_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    console.log("Email logs check:", emailsLastHour, error);

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

    // Parse port and secure settings properly
    const port = parseInt(process.env.EMAIL_SERVER_PORT ?? "587", 10);

    // Force secure to false for Mailtrap and most development SMTP servers
    const transportConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: port,
      secure: false, // Always false - let the server handle STARTTLS if available
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      // Add these for better compatibility
      tls: {
        // Don't fail on invalid certs for development
        rejectUnauthorized: false, // More permissive for development
        ciphers: "SSLv3", // Sometimes helps with compatibility
      },
      debug: true, // Enable debug logs
      logger: true, // Enable logger
      // Disable STARTTLS completely if still having issues
      ignoreTLS: false,
      requireTLS: false,
    };

    console.log("Transport config:", {
      ...transportConfig,
      auth: {
        user: transportConfig.auth.user,
        pass: "***hidden***",
      },
    });

    const transporter = nodemailer.createTransport(transportConfig);

    // Test the connection first
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError: unknown) {
      console.error("SMTP verification failed:", verifyError);
      if (verifyError instanceof Error) {
        return {
          message: `SMTP connection failed: ${verifyError.message}`,
          emailSent: false,
        };
      }
      return {
        message: "SMTP connection failed",
        emailSent: false,
      };
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/verify?token=${token}`;
    console.log("Verification URL:", verificationUrl);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Bienvenue chez Cognacia",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Cognacia</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(53, 88, 105, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-title {
            font-size: 28px;
            font-weight: 600;
            color: #355869;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .welcome-text {
            font-size: 16px;
            color: #666666;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .verification-section {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            border-left: 4px solid #355869;
        }
        
        .verification-title {
            font-size: 20px;
            font-weight: 600;
            color: #355869;
            margin-bottom: 15px;
        }
        
        .verification-text {
            font-size: 15px;
            color: #666666;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 15px rgba(53, 88, 105, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(53, 88, 105, 0.4);
        }
        
        .footer-text {
            font-size: 14px;
            color: #888888;
            text-align: center;
            margin-top: 30px;
            line-height: 1.5;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content {
                padding: 30px 20px;
            }
            
            .verification-section {
                padding: 25px 20px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 12px 25px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Cognacia</div>
            <div class="tagline">Votre Parcours d'Apprentissage Commence Ici</div>
        </div>
        
        <div class="content">
            <h1 class="welcome-title">Bienvenue chez Cognacia ! 🎉</h1>
            
            <p class="welcome-text">
                Salut ! Nous sommes absolument ravis de vous accueillir dans notre communauté d'apprentissage.
            </p>
            
            <p class="welcome-text">
                Vous êtes sur le point de vous lancer dans un parcours éducatif passionnant, et nous sommes impatients d'en faire partie avec vous !
            </p>
            
            <div class="verification-section">
                <h2 class="verification-title">📧 Vérification d'Email Requise</h2>
                <p class="verification-text">
                    Pour accéder à votre tableau de bord et commencer votre expérience d'apprentissage personnalisée, 
                    veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                </p>
                <a href="${verificationUrl}" class="cta-button">
                    Confirmer mon Adresse Email
                </a>
            </div>
            
            <p class="footer-text">
                Des questions ? Nous sommes là pour vous aider ! N'hésitez pas à nous contacter à tout moment. 
                Nous sommes toujours heureux de vous accompagner dans votre parcours d'apprentissage.
            </p>
        </div>
    </div>
</body>
</html>`,
    };

    console.log("Attempting to send email to:", email);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email send result:", info);

    if (info.messageId) {
      console.log("Email sent successfully, updating database...");

      const { error: updateError } = await supabase
        .from("users")
        .update({ verification_status: VERIFICATION_STATUS.EMAIL_SENT })
        .eq("id", userId);

      if (updateError) {
        console.error(
          "Failed to update user verification status:",
          updateError
        );
      }

      const { error: logError } = await supabase.from("email_logs").insert({
        user_id: userId,
        type: "verification",
        sent_at: new Date(),
      });

      if (logError) {
        console.error("Failed to log email:", logError);
      }

      return { message: "Email sent successfully.", emailSent: true };
    } else {
      console.error("No messageId returned from email send");
      return {
        message: "Failed to send email - no message ID",
        emailSent: false,
      };
    }
  } catch (error: unknown) {
    console.error("Failed to send email:", error);
    if (error instanceof Error) {
      return {
        message: `Email sending failed: ${error.message}`,
        emailSent: false,
      };
    }
    return {
      message: "Email sending failed",
      emailSent: false,
    };
  }
}

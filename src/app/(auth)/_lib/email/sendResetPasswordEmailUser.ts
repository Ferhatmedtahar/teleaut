import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(
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
      port: parseInt(process.env.EMAIL_SERVER_PORT ?? "465", 10),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Cognacia - Réinitialisation du Mot de Passe",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cognacia - Réinitialisation du Mot de Passe</title>
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
            padding: 35px 30px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .security-badge {
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .reset-title {
            font-size: 26px;
            font-weight: 600;
            color: #355869;
            margin-bottom: 25px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .greeting {
            font-size: 16px;
            color: #333333;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .main-text {
            font-size: 15px;
            color: #666666;
            margin-bottom: 18px;
            line-height: 1.6;
        }
        
        .security-warning {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-left: 4px solid #f97316;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .warning-title {
            font-size: 15px;
            color: #ea580c;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .warning-text {
            font-size: 14px;
            color: #c2410c;
            line-height: 1.5;
        }
        
        .action-section {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            border-left: 4px solid #355869;
        }
        
        .action-title {
            font-size: 18px;
            font-weight: 600;
            color: #355869;
            margin-bottom: 15px;
        }
        
        .action-text {
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
        
        .security-info {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .security-info-title {
            font-size: 14px;
            color: #0284c7;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .security-info-text {
            font-size: 13px;
            color: #0369a1;
            line-height: 1.4;
        }
        
        .footer-text {
            font-size: 14px;
            color: #888888;
            text-align: center;
            margin-top: 30px;
            line-height: 1.5;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
            margin: 25px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content {
                padding: 25px 20px;
            }
            
            .action-section {
                padding: 25px 20px;
            }
            
            .reset-title {
                font-size: 22px;
                flex-direction: column;
                gap: 5px;
            }
            
            .cta-button {
                padding: 12px 25px;
                font-size: 15px;

            }
            
            .security-badge {
                position: static;
                display: inline-block;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">

        <div class="header">
            <div class="security-badge">🔒 SÉCURITÉ</div>
            <div class="logo">Cognacia</div>
            <div class="tagline">Réinitialisation Sécurisée</div>
        </div>
        
 
        <div class="content">
            <h1 class="reset-title">
                🔑 Réinitialisation du Mot de Passe
            </h1>
            
          
            
            <p class="main-text">
                Vous avez demandé la réinitialisation de votre mot de passe sur Cognacia.
            </p>
            

            <div class="security-warning">
                <div class="warning-title">
                    ⚠️ Important - Sécurité
                </div>
                <div class="warning-text">
                    Si vous n'avez pas fait cette demande, veuillez ignorer cet email et votre mot de passe restera inchangé.
                </div>
            </div>
            
            <p class="main-text">
                Si c'est bien vous qui avez fait cette demande, cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </p>
      
            <div class="action-section">
                <h2 class="action-title">🔐 Créer un Nouveau Mot de Passe</h2>
                <p class="action-text">
                    Cliquez sur le bouton ci-dessous pour accéder à la page de réinitialisation sécurisée.
                </p>
                <a href="${verificationUrl}" class="cta-button">
                    Réinitialiser mon Mot de Passe
                </a>
            </div>
            
          
            <div class="security-info">
                <div class="security-info-title">🛡️ Note de Sécurité</div>
                <div class="security-info-text">
                    Ce lien est sécurisé et expire dans 24 heures. Si le lien a expiré, vous devrez faire une nouvelle demande de réinitialisation.
                </div>
            </div>
            
            <div class="divider"></div>
   
            <p class="footer-text">
                Des questions ou besoin d'aide ? N'hésitez pas à contacter nos <strong>Administrateurs</strong>. 
                Nous sommes toujours là pour vous aider !
            </p>
        </div>
    </div>
</body>
</html> `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.messageId) {
      await supabase.from("email_logs").insert({
        user_id: userId,
        type: "reset_password",
        sent_at: new Date(),
      });
    }

    return { message: "Email sent successfully.", emailSent: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { message: "Internal error.", emailSent: false };
  }
}

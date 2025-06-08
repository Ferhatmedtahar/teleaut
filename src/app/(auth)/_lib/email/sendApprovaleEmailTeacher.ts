import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmailTeacher(
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
      .eq("type", "verification")
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

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/verify?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Bienvenue dans l'Équipe Cognacia - Enseignant",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Cognacia - Enseignant</title>
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
            position: relative;
        }
        
        .teacher-badge {
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
        
        .teacher-highlight {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
            border-left: 4px solid #355869;
            position: relative;
        }
        
        .teacher-icon {
            font-size: 48px;
            margin-bottom: 15px;
            display: block;
        }
        
        .teacher-text {
            font-size: 16px;
            color: #355869;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .teacher-subtitle {
            font-size: 14px;
            color: #666666;
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
            color: white;
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
        
        .admin-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
            text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content {
                padding: 30px 20px;
            }
            
            .verification-section, .teacher-highlight {
                padding: 25px 20px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 12px 25px;
                font-size: 15px;
            }
            
            .teacher-badge {
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
            <div class="teacher-badge">👩‍🏫 ENSEIGNANT</div>
            <div class="logo">Cognacia</div>
            <div class="tagline">Plateforme d'Enseignement Innovante</div>
        </div>
        
    
        <div class="content">
            <h1 class="welcome-title">Bienvenue dans l'Équipe Cognacia ! 🎓</h1>
            
            <p class="welcome-text">
                Bonjour ! Nous sommes absolument ravis de vous accueillir dans notre communauté d'enseignants.
            </p>
            
            <p class="welcome-text">
                Nous sommes très enthousiastes de vous voir rejoindre notre équipe pédagogique !
            </p>
            
          
            <div class="teacher-highlight">
                <span class="teacher-icon">👨‍🏫</span>
                <div class="teacher-text">Bienvenue dans l'Équipe Enseignante</div>
                <div class="teacher-subtitle">
                    Vous faites maintenant partie d'une communauté d'éducateurs passionnés dédiés à l'excellence pédagogique.
                </div>
            </div>
            
      
            <div class="verification-section">
                <h2 class="verification-title">📧 Vérification d'Email Requise</h2>
                <p class="verification-text">
                    Pour accéder à votre tableau de bord enseignant et commencer votre parcours pédagogique, 
                    veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                </p>
                <a href="${verificationUrl}" 
   class="cta-button" 
   style="display: inline-block;
          background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
          color: white !important;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(53, 88, 105, 0.3);">
   Confirmer mon Adresse Email
</a>
            </div>
       
            <p class="footer-text">
                Des questions ? N'hésitez pas à contacter les <strong>Administrateurs</strong>. 
                Nous sommes toujours heureux de vous accompagner dans votre parcours d'enseignement !
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

import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmailApprovalDoctor(
  userId: string,
  email: string,
  token: string
): Promise<{ emailSent: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // Rate limiting check
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

    const port = parseInt(process.env.EMAIL_SERVER_PORT ?? "587", 10);

    // Try multiple configurations based on common email providers
    const configurations = [
      // Configuration 1: Standard STARTTLS (most common)
      {
        name: "STARTTLS",
        config: {
          host: process.env.EMAIL_SERVER_HOST,
          port: port === 465 ? 587 : port, // Force 587 if 465 was set incorrectly
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
            ciphers: "SSLv3",
          },
        },
      },
      // Configuration 2: No TLS (for troubleshooting)
      {
        name: "No TLS",
        config: {
          host: process.env.EMAIL_SERVER_HOST,
          port: port === 465 ? 587 : port,
          secure: false,
          ignoreTLS: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
      },
      // Configuration 3: SSL (if port 465)
      {
        name: "SSL",
        config: {
          host: process.env.EMAIL_SERVER_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      },
    ];

    let transporter;
    let lastError;

    // Try each configuration
    for (const { name, config } of configurations) {
      try {
        transporter = nodemailer.createTransport(config);

        // Test the connection
        await transporter.verify();

        break;
      } catch (error: unknown) {
        if (error instanceof Error) {
          error.message = `Configuration ${name}: ${error.message}`;
        }

        lastError = error;
        continue;
      }
    }

    if (!transporter) {
      console.error("All email configurations failed. Last error:", lastError);
      return {
        message:
          "Failed to configure email transport. Please check your email settings.",
        emailSent: false,
      };
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/verify?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Bienvenue dans l'Équipe TéléAutism - Professionnel de Santé",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez TéléAutism - Médecin</title>
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
            color: #1f2937;
            background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
            padding: 20px 0;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .email-container {
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(11, 125, 132, 0.12);
        }
        
        .header {
            background: linear-gradient(135deg, #0b7d84 0%, #00746b 50%, #005f5a 100%);
            padding: 45px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            blur: 60px;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 200px;
            height: 200px;
            background: rgba(135, 205, 176, 0.15);
            border-radius: 50%;
            blur: 40px;
        }
        
        .doctor-badge {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
            color: #ffffff;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 45px 35px;
        }
        
        .celebration-banner {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .celebration-emoji {
            font-size: 64px;
            margin-bottom: 15px;
            display: block;
            animation: celebrate 1s ease-in-out;
        }
        
        @keyframes celebrate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .welcome-title {
            font-size: 28px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 15px;
            text-align: center;
            line-height: 1.3;
        }
        
        .welcome-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.6;
        }
        
        .doctor-highlight {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 12px;
            padding: 28px;
            margin: 28px 0;
            text-align: center;
            border-left: 4px solid #87cdb0;
            box-shadow: 0 2px 8px rgba(135, 205, 176, 0.12);
        }
        
        .doctor-icon {
            font-size: 56px;
            margin-bottom: 15px;
            display: block;
        }
        
        .doctor-text {
            font-size: 18px;
            color: #0b7d84;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .doctor-subtitle {
            font-size: 14px;
            color: #00746b;
            line-height: 1.6;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin: 28px 0;
        }
        
        .info-card {
            background: #f9fafb;
            border-radius: 10px;
            padding: 18px;
            border-left: 3px solid #87cdb0;
        }
        
        .info-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #0b7d84;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-card-text {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
        }
        
        .verification-section {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border-radius: 12px;
            padding: 35px 30px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid #87cdb0;
            box-shadow: 0 4px 12px rgba(11, 125, 132, 0.08);
        }
        
        .verification-title {
            font-size: 22px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .verification-text {
            font-size: 15px;
            color: #374151;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #0b7d84 0%, #00746b 100%);
            color: white !important;
            padding: 16px 36px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(11, 125, 132, 0.3);
            letter-spacing: 0.3px;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(11, 125, 132, 0.4);
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 30px 0;
        }
        
        .footer-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 25px;
            margin-top: 30px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .contact-link {
            color: #0b7d84;
            text-decoration: none;
            font-weight: 600;
        }
        
        .contact-link:hover {
            text-decoration: underline;
        }
        
        .footer {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-legal {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 8px;
        }
        
        .footer-link {
            color: #0b7d84;
            text-decoration: none;
            font-weight: 500;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        @media only screen and (max-width: 600px) {
            body {
                padding: 0;
            }
            
            .email-container {
                border-radius: 0;
            }
            
            .header {
                padding: 40px 25px;
            }
            
            .content {
                padding: 35px 25px;
            }
            
            .verification-section, .doctor-highlight {
                padding: 28px 22px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
            
            .logo {
                font-size: 32px;
            }
            
            .celebration-emoji {
                font-size: 56px;
            }
            
            .verification-title {
                font-size: 20px;
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="doctor-badge">
                    👨‍⚕️ PROFESSIONNEL DE SANTÉ
                </div>
                <div class="logo">🩺 TéléAutism</div>
                <div class="tagline">Plateforme de santé en ligne spécialisée</div>
            </div>
            
            <div class="content">
                <div class="celebration-banner">
                    <span class="celebration-emoji">🎉</span>
                </div>
                
                <h1 class="welcome-title">
                    Félicitations ! Bienvenue dans l'Équipe TéléAutism
                </h1>
                
                <p class="welcome-subtitle">
                    Nous sommes absolument ravis de vous accueillir parmi nos professionnels de santé 
                    dédiés à l'accompagnement des personnes autistes.
                </p>
                
                <div class="doctor-highlight">
                    <span class="doctor-icon">👨‍⚕️</span>
                    <div class="doctor-text">Vous faites maintenant partie de notre équipe</div>
                    <div class="doctor-subtitle">
                        Rejoignez une communauté de médecins passionnés dédiés à fournir des soins 
                        de qualité et un accompagnement bienveillant aux patients et à leurs familles.
                    </div>
                </div>
                
                <p class="welcome-subtitle">
                    Votre expertise et votre engagement contribueront à améliorer la vie de nombreuses 
                    personnes. Ensemble, nous bâtissons un avenir où les soins sont accessibles, 
                    personnalisés et empreints d'humanité.
                </p>
                
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-card-title">
                            📅 Gestion des consultations
                        </div>
                        <div class="info-card-text">
                            Gérez vos disponibilités, acceptez ou reprogrammez les rendez-vous selon votre emploi du temps.
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-card-title">
                            📝 Notes médicales
                        </div>
                        <div class="info-card-text">
                            Rédigez et partagez des notes médicales sécurisées avec vos patients après chaque consultation.
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-card-title">
                            💬 Communication sécurisée
                        </div>
                        <div class="info-card-text">
                            Échangez avec vos patients via notre système de messagerie chiffrée et confidentielle.
                        </div>
                    </div>
                </div>
                
                <div class="verification-section">
                    <h2 class="verification-title">
                        📧 Dernière étape : Vérification d'Email
                    </h2>
                    <p class="verification-text">
                        Pour accéder à votre tableau de bord médecin et commencer à accompagner vos patients, 
                        veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                    </p>
                    <a href="${verificationUrl}" class="cta-button">
                        ✓ Confirmer mon Adresse Email
                    </a>
                </div>
                
                <div class="divider"></div>
                
                <div class="footer-section">
                    <p class="footer-text">
                        <strong>Besoin d'aide ?</strong><br>
                        Notre équipe support est là pour vous accompagner dans vos premiers pas sur la plateforme.
                    </p>
                    <p class="footer-text">
                        Contactez-nous : <a href="mailto:S.bensafiddine.ss@lagh-univ.dz" class="contact-link">S.bensafiddine.ss@lagh-univ.dz</a>
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-legal">
                    © 2025 TéléAutism - Plateforme de santé en ligne
                </p>
                <p class="footer-legal">
                    <a href="mailto:S.bensafiddine.ss@lagh-univ.dz" class="footer-link">S.bensafiddine.ss@lagh-univ.dz</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>`,
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send email:", error.message);
      return { message: `Internal error: ${error.message}`, emailSent: false };
    }
    console.error("Failed to send email:", error);
    return { message: `Internal error`, emailSent: false };
  }
}

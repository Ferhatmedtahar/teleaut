import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmailPatient(
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

    const transporter = nodemailer.createTransport(transportConfig);

    // Test the connection first
    try {
      await transporter.verify();
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

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Bienvenue chez TéléAutism - Confirmez votre Email",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez TéléAutism</title>
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
            padding: 50px 30px;
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
        
        .welcome-emoji {
            font-size: 72px;
            margin-bottom: 15px;
            display: block;
            animation: wave 1.5s ease-in-out infinite;
            position: relative;
            z-index: 1;
        }
        
        @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            75% { transform: rotate(-15deg); }
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
        
        .welcome-title {
            font-size: 28px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.3;
        }
        
        .welcome-text {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1.6;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin: 30px 0;
        }
        
        .feature-card {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: start;
            gap: 15px;
            border-left: 3px solid #87cdb0;
        }
        
        .feature-icon {
            font-size: 32px;
            flex-shrink: 0;
        }
        
        .feature-content {
            flex: 1;
        }
        
        .feature-title {
            font-size: 16px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 5px;
        }
        
        .feature-text {
            font-size: 14px;
            color: #00746b;
            line-height: 1.5;
        }
        
        .verification-section {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
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
        
        .info-box {
            background: #f9fafb;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .info-box-title {
            font-size: 16px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 10px;
        }
        
        .info-box-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
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
            text-align: center;
        }
        
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 10px;
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
            
            .verification-section, .info-box, .footer-section {
                padding: 25px 20px;
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
            
            .welcome-emoji {
                font-size: 64px;
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
                <span class="welcome-emoji">👋</span>
                <div class="logo">🩺 TéléAutism</div>
                <div class="tagline">Votre accompagnement commence ici</div>
            </div>
            
            <div class="content">
                <h1 class="welcome-title">
                    Bienvenue dans la Communauté TéléAutism ! 🎉
                </h1>
                
                <p class="welcome-text">
                    Nous sommes absolument ravis de vous accueillir. Vous venez de faire le premier pas 
                    vers un accompagnement médical accessible, personnalisé et bienveillant.
                </p>
                
                <p class="welcome-text">
                    Notre plateforme vous permet de consulter des médecins spécialisés en autisme, 
                    de suivre vos consultations et d'accéder à vos notes médicales en toute sécurité.
                </p>
                
                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-icon">📅</span>
                        <div class="feature-content">
                            <div class="feature-title">Consultations en Ligne</div>
                            <div class="feature-text">
                                Prenez rendez-vous facilement avec des médecins spécialisés selon vos besoins
                            </div>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <span class="feature-icon">📝</span>
                        <div class="feature-content">
                            <div class="feature-title">Notes Médicales</div>
                            <div class="feature-text">
                                Accédez à vos rapports médicaux et suivez votre parcours de soins
                            </div>
                        </div>
                    </div>
                    
                    <div class="feature-card">
                        <span class="feature-icon">💬</span>
                        <div class="feature-content">
                            <div class="feature-title">Communication Sécurisée</div>
                            <div class="feature-text">
                                Échangez avec vos médecins via notre messagerie chiffrée et confidentielle
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="verification-section">
                    <h2 class="verification-title">
                        📧 Confirmez votre Adresse Email
                    </h2>
                    <p class="verification-text">
                        Pour accéder à votre espace patient et commencer à bénéficier de tous nos services, 
                        veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                    </p>
                    <a href="${verificationUrl}" class="cta-button">
                        ✓ Confirmer mon Email
                    </a>
                </div>
                
                <div class="info-box">
                    <div class="info-box-title">🔐 Votre sécurité, notre priorité</div>
                    <div class="info-box-text">
                        Toutes vos données médicales sont chiffrées et protégées. Nous respectons votre vie privée 
                        et suivons les normes de sécurité les plus strictes en matière de données de santé.
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="footer-section">
                    <p class="footer-text">
                        <strong>Besoin d'aide pour démarrer ?</strong>
                    </p>
                    <p class="footer-text">
                        Notre équipe support est disponible pour vous accompagner. 
                        Contactez-nous à <a href="mailto:S.bensafiddine.ss@lagh-univ.dz" class="contact-link">S.bensafiddine.ss@lagh-univ.dz</a>
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
// import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
// import { createClient } from "@/lib/supabase/server";
// import nodemailer from "nodemailer";

// export async function sendVerificationEmailPatient(
//   userId: string,
//   email: string,
//   token: string
// ): Promise<{ emailSent: boolean; message: string }> {
//   try {
//     const supabase = await createClient();

//     const { data: emailsLastHour, error } = await supabase
//       .from("email_logs")
//       .select("id")
//       .eq("user_id", userId)
//       .eq("type", "verification")
//       .gte("sent_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

//     if (error) {
//       console.error("Failed to check email logs:", error);
//       return { message: "Internal error.", emailSent: false };
//     }

//     if ((emailsLastHour?.length ?? 0) >= 3) {
//       return {
//         message:
//           "Rate limit exceeded. You can request up to 3 reset emails per hour.",
//         emailSent: false,
//       };
//     }

//     // Parse port and secure settings properly
//     const port = parseInt(process.env.EMAIL_SERVER_PORT ?? "587", 10);

//     // Force secure to false for Mailtrap and most development SMTP servers
//     const transportConfig = {
//       host: process.env.EMAIL_SERVER_HOST,
//       port: port,
//       secure: false, // Always false - let the server handle STARTTLS if available
//       auth: {
//         user: process.env.EMAIL_SERVER_USER,
//         pass: process.env.EMAIL_SERVER_PASSWORD,
//       },
//       // Add these for better compatibility
//       tls: {
//         // Don't fail on invalid certs for development
//         rejectUnauthorized: false, // More permissive for development
//         ciphers: "SSLv3", // Sometimes helps with compatibility
//       },
//       debug: true, // Enable debug logs
//       logger: true, // Enable logger
//       // Disable STARTTLS completely if still having issues
//       ignoreTLS: false,
//       requireTLS: false,
//     };

//     const transporter = nodemailer.createTransport(transportConfig);

//     // Test the connection first
//     try {
//       await transporter.verify();
//     } catch (verifyError: unknown) {
//       console.error("SMTP verification failed:", verifyError);
//       if (verifyError instanceof Error) {
//         return {
//           message: `SMTP connection failed: ${verifyError.message}`,
//           emailSent: false,
//         };
//       }
//       return {
//         message: "SMTP connection failed",
//         emailSent: false,
//       };
//     }

//     const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/verify?token=${token}`;

//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Bienvenue chez TeleAustism",
//       html: `<!DOCTYPE html>
// <html lang="fr">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Bienvenue chez Cognacia</title>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
//             line-height: 1.6;
//             color: #333333;
//             background-color: #f8f9fa;
//         }

//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             border-radius: 12px;
//             overflow: hidden;
//             box-shadow: 0 4px 20px rgba(53, 88, 105, 0.1);
//         }

//         .header {
//             background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
//             padding: 40px 30px;
//             text-align: center;
//             color: white;
//         }

//         .logo {
//             font-size: 32px;
//             font-weight: 700;
//             margin-bottom: 10px;
//             letter-spacing: -0.5px;
//         }

//         .tagline {
//             font-size: 16px;
//             opacity: 0.9;
//             font-weight: 300;
//         }

//         .content {
//             padding: 40px 30px;
//         }

//         .welcome-title {
//             font-size: 28px;
//             font-weight: 600;
//             color: #355869;
//             margin-bottom: 20px;
//             text-align: center;
//         }

//         .welcome-text {
//             font-size: 16px;
//             color: #666666;
//             margin-bottom: 20px;
//             text-align: center;
//         }

//         .verification-section {
//             background-color: #f8f9fa;
//             border-radius: 12px;
//             padding: 30px;
//             margin: 30px 0;
//             text-align: center;
//             border-left: 4px solid #355869;
//         }

//         .verification-title {
//             font-size: 20px;
//             font-weight: 600;
//             color: #355869;
//             margin-bottom: 15px;
//         }

//         .verification-text {
//             font-size: 15px;
//             color: #666666;
//             margin-bottom: 25px;
//             line-height: 1.5;
//         }

//         .cta-button {
//             display: inline-block;
//             background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
//             color: white !important;
//             padding: 15px 30px;
//             text-decoration: none;
//             border-radius: 8px;
//             font-weight: 600;
//             font-size: 16px;
//             transition: transform 0.2s ease;
//             box-shadow: 0 4px 15px rgba(53, 88, 105, 0.3);
//         }

//         .cta-button:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 20px rgba(53, 88, 105, 0.4);
//         }

//         .footer-text {
//             font-size: 14px;
//             color: #888888;
//             text-align: center;
//             margin-top: 30px;
//             line-height: 1.5;
//         }

//         @media only screen and (max-width: 600px) {
//             .email-container {
//                 margin: 0;
//                 border-radius: 0;
//             }

//             .header, .content {
//                 padding: 30px 20px;
//             }

//             .verification-section {
//                 padding: 25px 20px;
//             }

//             .welcome-title {
//                 font-size: 24px;
//             }

//             .cta-button {
//                 padding: 12px 25px;
//                 font-size: 15px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <div class="header">
//             <div class="logo">TeleAustism</div>
//             <div class="tagline">Votre Parcours d'Apprentissage Commence Ici</div>
//         </div>

//         <div class="content">
//             <h1 class="welcome-title">Bienvenue chez TeleAustism ! 🎉</h1>

//             <p class="welcome-text">
//                 Salut ! Nous sommes absolument ravis de vous accueillir dans notre communauté d'apprentissage.
//             </p>

//             <p class="welcome-text">
//                 Vous êtes sur le point de vous lancer dans un parcours éducatif passionnant, et nous sommes impatients d'en faire partie avec vous !
//             </p>

//             <div class="verification-section">
//                 <h2 class="verification-title">📧 Vérification d'Email Requise</h2>
//                 <p class="verification-text">
//                     Pour accéder à votre tableau de bord et commencer votre expérience d'apprentissage personnalisée,
//                     veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
//                 </p>
//                 <a href="${verificationUrl}" class="cta-button">
//                     Confirmer mon Adresse Email
//                 </a>
//             </div>

//             <p class="footer-text">
//                 Des questions ? Nous sommes là pour vous aider ! N'hésitez pas à nous contacter à tout moment.
//                 Nous sommes toujours heureux de vous accompagner dans votre parcours d'apprentissage.
//             </p>
//         </div>
//     </div>
// </body>
// </html>`,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     if (info.messageId) {
//       const { error: updateError } = await supabase
//         .from("users")
//         .update({ verification_status: VERIFICATION_STATUS.EMAIL_SENT })
//         .eq("id", userId);

//       if (updateError) {
//         console.error(
//           "Failed to update user verification status:",
//           updateError
//         );
//       }

//       const { error: logError } = await supabase.from("email_logs").insert({
//         user_id: userId,
//         type: "verification",
//         sent_at: new Date(),
//       });

//       if (logError) {
//         console.error("Failed to log email:", logError);
//       }

//       return { message: "Email sent successfully.", emailSent: true };
//     } else {
//       console.error("No messageId returned from email send");
//       return {
//         message: "Failed to send email - no message ID",
//         emailSent: false,
//       };
//     }
//   } catch (error: unknown) {
//     console.error("Failed to send email:", error);
//     if (error instanceof Error) {
//       return {
//         message: `Email sending failed: ${error.message}`,
//         emailSent: false,
//       };
//     }
//     return {
//       message: "Email sending failed",
//       emailSent: false,
//     };
//   }
// }

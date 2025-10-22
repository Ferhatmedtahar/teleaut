import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function sendVerificationEmailRejectDoctor(
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

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "TéléAutism - Mise à jour de votre Candidature",
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TéléAutism - Mise à jour de votre Candidature</title>
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
            padding: 40px 30px;
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
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #ffffff;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 45px 35px;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            color: #dc2626;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 25px;
            border: 1px solid #fecaca;
        }
        
        .status-title {
            font-size: 26px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 25px;
            line-height: 1.3;
        }
        
        .greeting {
            font-size: 16px;
            color: #374151;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .main-text {
            font-size: 15px;
            color: #6b7280;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        
        .decision-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left: 4px solid #ef4444;
            border-radius: 12px;
            padding: 28px;
            margin: 28px 0;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
        }
        
        .decision-text {
            font-size: 16px;
            color: #dc2626;
            font-weight: 600;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        
        .decision-explanation {
            font-size: 14px;
            color: #991b1b;
            line-height: 1.6;
        }
        
        .encouragement-section {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-left: 4px solid #87cdb0;
            border-radius: 12px;
            padding: 28px;
            margin: 28px 0;
            box-shadow: 0 2px 8px rgba(135, 205, 176, 0.12);
        }
        
        .encouragement-title {
            font-size: 17px;
            color: #0b7d84;
            font-weight: 700;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .encouragement-text {
            font-size: 14px;
            color: #00746b;
            line-height: 1.6;
        }
        
        .support-section {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 28px 0;
            text-align: center;
            border: 1px solid #87cdb0;
        }
        
        .support-text {
            font-size: 15px;
            color: #374151;
            margin-bottom: 18px;
            font-weight: 500;
        }
        
        .contact-button {
            display: inline-block;
            background: linear-gradient(135deg, #0b7d84 0%, #00746b 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(11, 125, 132, 0.25);
        }
        
        .contact-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(11, 125, 132, 0.35);
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 30px 0;
        }
        
        .signature {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #f3f4f6;
        }
        
        .signature-text {
            font-size: 15px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .team-name {
            font-size: 16px;
            color: #0b7d84;
            font-weight: 700;
        }
        
        .footer {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 13px;
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
                padding: 35px 25px;
            }
            
            .content {
                padding: 35px 25px;
            }
            
            .decision-section, .encouragement-section, .support-section {
                padding: 22px 18px;
            }
            
            .status-title {
                font-size: 24px;
            }
            
            .contact-button {
                padding: 12px 28px;
                font-size: 14px;
            }
            
            .logo {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="logo">🩺 TéléAutism</div>
                <div class="tagline">Plateforme de santé en ligne</div>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="status-badge">
                        📋 Mise à jour de candidature
                    </span>
                </div>
                
                <h1 class="status-title">Statut de votre Candidature</h1>
                
                <p class="greeting">Cher(e) Candidat(e) Médecin,</p>
                
                <p class="main-text">
                    Nous vous remercions sincèrement d'avoir pris le temps de postuler pour rejoindre TéléAutism 
                    en tant que professionnel de santé. Votre intérêt pour notre plateforme dédiée à l'accompagnement 
                    des personnes autistes nous touche profondément.
                </p>
                
                <div class="decision-section">
                    <div class="decision-text">
                        📝 Après un examen attentif de votre candidature, nous avons décidé de ne pas donner suite à ce stade.
                    </div>
                    <div class="decision-explanation">
                        Cette décision repose sur plusieurs critères d'évaluation stricts que nous appliquons pour 
                        garantir la meilleure qualité de soins à nos patients. Nous tenons à vous assurer qu'elle 
                        a été prise après mûre réflexion.
                    </div>
                </div>
                
                <p class="main-text">
                    Nous comprenons que cette nouvelle puisse être décevante, mais nous souhaitons souligner 
                    que notre processus de sélection est rigoureux afin d'assurer l'excellence des soins 
                    dispensés sur notre plateforme.
                </p>
                
                <div class="encouragement-section">
                    <div class="encouragement-title">
                        🔄 Opportunités Futures
                    </div>
                    <div class="encouragement-text">
                        Nous vous encourageons vivement à postuler de nouveau à l'avenir, particulièrement si 
                        vous avez acquis de nouvelles expériences, certifications ou qualifications dans le 
                        domaine de l'autisme. Notre plateforme évolue constamment et de nouvelles opportunités 
                        pourraient correspondre davantage à votre profil.
                    </div>
                </div>
                
                <p class="main-text">
                    Nous apprécions sincèrement votre engagement envers l'accompagnement des personnes autistes 
                    et vous souhaitons beaucoup de succès dans votre pratique médicale et vos projets professionnels.
                </p>
                
                <div class="support-section">
                    <p class="support-text">
                        💬 Des questions sur votre candidature ou souhaitez-vous obtenir des retours ?
                    </p>
                    <a href="mailto:S.bensafiddine.ss@lagh-univ.dz" class="contact-button">
                        Contacter notre Équipe
                    </a>
                </div>
                
                <div class="signature">
                    <p class="signature-text">Avec nos salutations distinguées,</p>
                    <p class="team-name">L'Équipe TéléAutism 💙</p>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    © 2025 TéléAutism - Plateforme de santé en ligne
                </p>
                <p class="footer-text">
                    <a href="mailto:S.bensafiddine.ss@lagh-univ.dz" class="footer-link">S.bensafiddine.ss@lagh-univ.dz</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
      `,
    };
    const info = await transporter.sendMail(mailOptions);

    if (info.messageId) {
      await supabase.from("email_logs").insert({
        user_id: userId,
        type: "reject_teacher",
        sent_at: new Date(),
      });
    }

    return { message: "Email sent successfully.", emailSent: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { message: "Internal error.", emailSent: false };
  }
}
// import { createClient } from "@/lib/supabase/server";
// import nodemailer from "nodemailer";

// export async function sendVerificationEmailRejectDoctor(
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

//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_SERVER_HOST,
//       port: parseInt(process.env.EMAIL_SERVER_PORT ?? "465", 10),
//       secure: process.env.EMAIL_SERVER_SECURE === "true",
//       auth: {
//         user: process.env.EMAIL_SERVER_USER,
//         pass: process.env.EMAIL_SERVER_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Cognacia - Mise à jour de votre Candidature",
//       html: `
//        <!DOCTYPE html>
// <html lang="fr">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Cognacia - Mise à jour de votre Candidature</title>
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
//             padding: 30px 30px 25px;
//             text-align: center;
//             color: white;
//         }

//         .logo {
//             font-size: 28px;
//             font-weight: 700;
//             margin-bottom: 8px;
//             letter-spacing: -0.5px;
//         }

//         .tagline {
//             font-size: 14px;
//             opacity: 0.9;
//             font-weight: 300;
//         }

//         .content {
//             padding: 40px 30px;
//         }

//         .status-title {
//             font-size: 24px;
//             font-weight: 600;
//             color: #355869;
//             margin-bottom: 25px;
//             text-align: center;
//         }

//         .greeting {
//             font-size: 16px;
//             color: #333333;
//             margin-bottom: 20px;
//             font-weight: 500;
//         }

//         .main-text {
//             font-size: 15px;
//             color: #666666;
//             margin-bottom: 18px;
//             line-height: 1.6;
//         }

//         .decision-section {
//             background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%);
//             border-left: 4px solid #ef4444;
//             border-radius: 8px;
//             padding: 25px;
//             margin: 25px 0;
//         }

//         .decision-text {
//             font-size: 15px;
//             color: #dc2626;
//             font-weight: 500;
//             margin-bottom: 15px;
//         }

//         .decision-explanation {
//             font-size: 14px;
//             color: #991b1b;
//             line-height: 1.5;
//         }

//         .encouragement-section {
//             background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
//             border-left: 4px solid #0ea5e9;
//             border-radius: 8px;
//             padding: 25px;
//             margin: 25px 0;
//         }

//         .encouragement-title {
//             font-size: 16px;
//             color: #0284c7;
//             font-weight: 600;
//             margin-bottom: 12px;
//         }

//         .encouragement-text {
//             font-size: 14px;
//             color: #0369a1;
//             line-height: 1.5;
//         }

//         .support-section {
//             background-color: #f8f9fa;
//             border-radius: 8px;
//             padding: 20px;
//             margin: 25px 0;
//             text-align: center;
//         }

//         .support-text {
//             font-size: 14px;
//             color: #666666;
//             margin-bottom: 15px;
//         }

//         .contact-button {
//             display: inline-block;
//             background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
//             color: white;
//             padding: 12px 25px;
//             text-decoration: none;
//             border-radius: 6px;
//             font-weight: 500;
//             font-size: 14px;
//             transition: transform 0.2s ease;
//         }

//         .contact-button:hover {
//             transform: translateY(-1px);
//         }

//         .signature {
//             margin-top: 35px;
//             padding-top: 20px;
//             border-top: 1px solid #e0e0e0;
//         }

//         .signature-text {
//             font-size: 15px;
//             color: #333333;
//             margin-bottom: 8px;
//         }

//         .team-name {
//             font-size: 15px;
//             color: #355869;
//             font-weight: 600;
//         }

//         @media only screen and (max-width: 600px) {
//             .email-container {
//                 margin: 0;
//                 border-radius: 0;
//             }

//             .header, .content {
//                 padding: 25px 20px;
//             }

//             .decision-section, .encouragement-section, .support-section {
//                 padding: 20px 15px;
//             }

//             .status-title {
//                 font-size: 22px;
//             }

//             .contact-button {
//                 padding: 10px 20px;
//                 font-size: 13px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">

//         <div class="header">
//             <div class="logo">Cognacia</div>
//             <div class="tagline">Mise à jour de votre Candidature</div>
//         </div>

//         <div class="content">
//             <h1 class="status-title">📋 Statut de votre Candidature</h1>

//             <p class="greeting">Cher(e) Candidat(e) Enseignant(e),</p>

//             <p class="main-text">
//                 Nous vous remercions sincèrement d'avoir pris le temps de postuler pour rejoindre Cognacia en tant qu'enseignant(e).
//                 Nous avons examiné attentivement votre candidature.
//             </p>

//             <div class="decision-section">
//                 <div class="decision-text">
//                     📝 Après mûre réflexion, nous avons décidé de ne pas donner suite à votre candidature à ce stade.
//                 </div>
//                 <div class="decision-explanation">
//                     Cette décision s'appuie sur plusieurs critères d'évaluation, et nous tenons à vous assurer
//                     qu'elle n'a pas été prise à la légère.
//                 </div>
//             </div>

//             <div class="encouragement-section">
//                 <div class="encouragement-title">🔄 Candidatures Futures</div>
//                 <div class="encouragement-text">
//                     Nous vous encourageons vivement à postuler de nouveau dans le futur,
//                     particulièrement si vous avez acquis de nouvelles expériences ou qualifications
//                     qui enrichiraient votre profil pédagogique.
//                 </div>
//             </div>

//             <p class="main-text">
//                 Nous apprécions votre intérêt pour notre plateforme éducative et nous vous souhaitons
//                 beaucoup de succès dans vos projets d'enseignement.
//             </p>

//             <div class="support-section">
//                 <p class="support-text">
//                     Des questions ou souhaitez-vous obtenir des retours sur votre candidature ?
//                 </p>
//                 <a href="mailto:rayensouissi08@gmail.com" class="contact-button">
//                     Contacter notre Équipe
//                 </a>
//             </div>

//             <div class="signature">
//                 <p class="signature-text">Cordialement,</p>
//                 <p class="team-name">L'Équipe Cognacia</p>
//             </div>
//         </div>
//     </div>
// </body>
// </html>
//       `,
//     };
//     const info = await transporter.sendMail(mailOptions);

//     if (info.messageId) {
//       await supabase.from("email_logs").insert({
//         user_id: userId,
//         type: "reject_teacher",
//         sent_at: new Date(),
//       });
//     }

//     return { message: "Email sent successfully.", emailSent: true };
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     return { message: "Internal error.", emailSent: false };
//   }
// }

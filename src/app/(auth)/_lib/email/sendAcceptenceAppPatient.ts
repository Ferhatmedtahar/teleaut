// lib/email/sendAppointmentConfirmationEmail.ts
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

type AppointmentDetails = {
  appointment_date: string;
  doctor_name: string;
  doctor_specialty?: string;
};

export async function sendAppointmentConfirmationEmail(
  userId: string,
  email: string,
  appointmentDetails: AppointmentDetails
): Promise<{ emailSent: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // Rate limiting check
    const { data: emailsLastHour, error } = await supabase
      .from("email_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "appointment_confirmation")
      .gte("sent_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Failed to check email logs:", error);
      return { message: "Internal error.", emailSent: false };
    }

    if ((emailsLastHour?.length ?? 0) >= 5) {
      return {
        message: "Rate limit exceeded.",
        emailSent: false,
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT ?? "465", 10),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Format date in French
    const appointmentDate = new Date(appointmentDetails.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = appointmentDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "TéléAutism - Rendez-vous Confirmé ✓",
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TéléAutism - Rendez-vous Confirmé</title>
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
        
        .confirmation-badge {
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
        
        .success-icon {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .checkmark {
            font-size: 80px;
            display: block;
            margin-bottom: 10px;
            animation: scaleIn 0.5s ease-out;
        }
        
        @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .confirmation-title {
            font-size: 28px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 15px;
            text-align: center;
            line-height: 1.3;
        }
        
        .confirmation-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.6;
        }
        
        .appointment-card {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 28px 0;
            border-left: 4px solid #87cdb0;
            box-shadow: 0 2px 8px rgba(135, 205, 176, 0.12);
        }
        
        .appointment-header {
            font-size: 18px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .appointment-detail {
            display: flex;
            align-items: start;
            gap: 15px;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(135, 205, 176, 0.3);
        }
        
        .appointment-detail:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .detail-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .detail-content {
            flex: 1;
        }
        
        .detail-label {
            font-size: 12px;
            color: #00746b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .detail-value {
            font-size: 16px;
            color: #0b7d84;
            font-weight: 600;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border-radius: 12px;
            padding: 35px 30px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid #87cdb0;
            box-shadow: 0 4px 12px rgba(11, 125, 132, 0.08);
        }
        
        .cta-title {
            font-size: 18px;
            font-weight: 700;
            color: #0b7d84;
            margin-bottom: 12px;
        }
        
        .cta-text {
            font-size: 14px;
            color: #374151;
            margin-bottom: 20px;
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
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #93c5fd;
            border-radius: 12px;
            padding: 25px;
            margin: 28px 0;
        }
        
        .info-title {
            font-size: 15px;
            color: #0284c7;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-text {
            font-size: 14px;
            color: #0369a1;
            line-height: 1.6;
        }
        
        .tips-section {
            background: #f9fafb;
            border-radius: 12px;
            padding: 25px;
            margin: 28px 0;
        }
        
        .tips-title {
            font-size: 16px;
            color: #0b7d84;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .tip-item {
            display: flex;
            align-items: start;
            gap: 10px;
            margin-bottom: 12px;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
        }
        
        .tip-icon {
            color: #87cdb0;
            font-weight: bold;
            flex-shrink: 0;
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
            
            .appointment-card, .cta-section, .info-box, .tips-section {
                padding: 22px 18px;
            }
            
            .confirmation-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .checkmark {
                font-size: 64px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="confirmation-badge">
                    ✓ CONFIRMÉ
                </div>
                <div class="logo">🩺 TéléAutism</div>
                <div class="tagline">Votre rendez-vous est confirmé</div>
            </div>
            
            <div class="content">
                <div class="success-icon">
                    <span class="checkmark">✓</span>
                </div>
                
                <h1 class="confirmation-title">
                    Rendez-vous Confirmé !
                </h1>
                
                <p class="confirmation-subtitle">
                    Excellente nouvelle ! Votre médecin a confirmé votre rendez-vous. 
                    Vous recevrez les meilleurs soins adaptés à vos besoins.
                </p>
                
                <div class="appointment-card">
                    <div class="appointment-header">
                        📋 Détails du Rendez-vous
                    </div>
                    
                    <div class="appointment-detail">
                        <span class="detail-icon">👨‍⚕️</span>
                        <div class="detail-content">
                            <div class="detail-label">Médecin</div>
                            <div class="detail-value">${
                              appointmentDetails.doctor_name
                            }</div>
                            ${
                              appointmentDetails.doctor_specialty
                                ? `<div style="font-size: 13px; color: #00746b; margin-top: 4px;">${appointmentDetails.doctor_specialty}</div>`
                                : ""
                            }
                        </div>
                    </div>
                    
                    <div class="appointment-detail">
                        <span class="detail-icon">📅</span>
                        <div class="detail-content">
                            <div class="detail-label">Date</div>
                            <div class="detail-value">${formattedDate}</div>
                        </div>
                    </div>
                    
                    <div class="appointment-detail">
                        <span class="detail-icon">⏰</span>
                        <div class="detail-content">
                            <div class="detail-label">Heure</div>
                            <div class="detail-value">${formattedTime}</div>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    <h2 class="cta-title">Accédez à votre Espace Patient</h2>
                    <p class="cta-text">
                        Consultez tous les détails de votre rendez-vous, échangez avec votre médecin 
                        et préparez votre consultation.
                    </p>
                    <a href="${
                      process.env.NEXT_PUBLIC_SITE_URL
                    }/appointments" class="cta-button">
                        Voir mes Rendez-vous
                    </a>
                </div>
                
                <div class="info-box">
                    <div class="info-title">
                        💡 Important
                    </div>
                    <div class="info-text">
                        Vous recevrez un rappel 24 heures avant votre rendez-vous. Si vous devez 
                        modifier ou annuler, veuillez le faire au moins 24 heures à l'avance.
                    </div>
                </div>
                
                <div class="tips-section">
                    <div class="tips-title">📝 Pour préparer votre consultation</div>
                    <div class="tip-item">
                        <span class="tip-icon">✓</span>
                        <span>Notez les questions que vous souhaitez poser à votre médecin</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">✓</span>
                        <span>Préparez la liste de vos médicaments actuels si applicable</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">✓</span>
                        <span>Assurez-vous d'avoir une connexion internet stable</span>
                    </div>
                    <div class="tip-item">
                        <span class="tip-icon">✓</span>
                        <span>Connectez-vous 5 minutes avant l'heure prévue</span>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="footer-section">
                    <p class="footer-text">
                        <strong>Besoin d'aide ?</strong>
                    </p>
                    <p class="footer-text">
                        Notre équipe support est disponible pour vous assister. 
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
      await supabase.from("email_logs").insert({
        user_id: userId,
        type: "appointment_confirmation",
        sent_at: new Date(),
      });
    }

    return { message: "Email sent successfully.", emailSent: true };
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    return { message: "Internal error.", emailSent: false };
  }
}

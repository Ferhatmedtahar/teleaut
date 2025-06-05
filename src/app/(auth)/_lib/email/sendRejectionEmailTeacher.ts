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

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Cognacia - Mise à jour de votre Candidature",
      html: `
       <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cognacia - Mise à jour de votre Candidature</title>
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
            padding: 30px 30px 25px;
            text-align: center;
            color: white;
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
        
        .status-title {
            font-size: 24px;
            font-weight: 600;
            color: #355869;
            margin-bottom: 25px;
            text-align: center;
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
        
        .decision-section {
            background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%);
            border-left: 4px solid #ef4444;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .decision-text {
            font-size: 15px;
            color: #dc2626;
            font-weight: 500;
            margin-bottom: 15px;
        }
        
        .decision-explanation {
            font-size: 14px;
            color: #991b1b;
            line-height: 1.5;
        }
        
        .encouragement-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid #0ea5e9;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .encouragement-title {
            font-size: 16px;
            color: #0284c7;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .encouragement-text {
            font-size: 14px;
            color: #0369a1;
            line-height: 1.5;
        }
        
        .support-section {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .support-text {
            font-size: 14px;
            color: #666666;
            margin-bottom: 15px;
        }
        
        .contact-button {
            display: inline-block;
            background: linear-gradient(135deg, #355869 0%, #4a7280 100%);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            transition: transform 0.2s ease;
        }
        
        .contact-button:hover {
            transform: translateY(-1px);
        }
        
        .signature {
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        
        .signature-text {
            font-size: 15px;
            color: #333333;
            margin-bottom: 8px;
        }
        
        .team-name {
            font-size: 15px;
            color: #355869;
            font-weight: 600;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content {
                padding: 25px 20px;
            }
            
            .decision-section, .encouragement-section, .support-section {
                padding: 20px 15px;
            }
            
            .status-title {
                font-size: 22px;
            }
            
            .contact-button {
                padding: 10px 20px;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">

        <div class="header">
            <div class="logo">Cognacia</div>
            <div class="tagline">Mise à jour de votre Candidature</div>
        </div>
        
   
        <div class="content">
            <h1 class="status-title">📋 Statut de votre Candidature</h1>
            
            <p class="greeting">Cher(e) Candidat(e) Enseignant(e),</p>
            
            <p class="main-text">
                Nous vous remercions sincèrement d'avoir pris le temps de postuler pour rejoindre Cognacia en tant qu'enseignant(e). 
                Nous avons examiné attentivement votre candidature.
            </p>
 
            <div class="decision-section">
                <div class="decision-text">
                    📝 Après mûre réflexion, nous avons décidé de ne pas donner suite à votre candidature à ce stade.
                </div>
                <div class="decision-explanation">
                    Cette décision s'appuie sur plusieurs critères d'évaluation, et nous tenons à vous assurer 
                    qu'elle n'a pas été prise à la légère.
                </div>
            </div>
            
        
            <div class="encouragement-section">
                <div class="encouragement-title">🔄 Candidatures Futures</div>
                <div class="encouragement-text">
                    Nous vous encourageons vivement à postuler de nouveau dans le futur, 
                    particulièrement si vous avez acquis de nouvelles expériences ou qualifications 
                    qui enrichiraient votre profil pédagogique.
                </div>
            </div>
            
            <p class="main-text">
                Nous apprécions votre intérêt pour notre plateforme éducative et nous vous souhaitons 
                beaucoup de succès dans vos projets d'enseignement.
            </p>
            
            
            <div class="support-section">
                <p class="support-text">
                    Des questions ou souhaitez-vous obtenir des retours sur votre candidature ?
                </p>
                <a href="mailto:rayensouissi08@gmail.com" class="contact-button">
                    Contacter notre Équipe
                </a>
            </div>
            
       
            <div class="signature">
                <p class="signature-text">Cordialement,</p>
                <p class="team-name">L'Équipe Cognacia</p>
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

"use server";

import { DoctorFormSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { z } from "zod";

// Server-side schema for doctors with all required fields
const DoctorServerSchema = DoctorFormSchema.omit({
  confirmPassword: true,
}).extend({
  // Ensure role is doctor
  role: z.literal(roles.doctor),
  // Add any server-specific validation
  yearsOfExperience: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z
      .number({
        required_error: "Les années d'expérience sont requises",
        invalid_type_error:
          "Les années d'expérience doivent être un nombre valide",
      })
      .min(0, "Les années d'expérience ne peuvent pas être négatives")
      .max(99, "Les années d'expérience ne peuvent pas dépasser 99 ans")
  ),
  consultationFee: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const num = parseFloat(val);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z
      .number({
        required_error: "Les frais de consultation sont requis",
        invalid_type_error:
          "Les frais de consultation doivent être un nombre valide",
      })
      .min(0, "Les frais de consultation ne peuvent pas être négatifs")
  ),
});

type DoctorServerData = z.infer<typeof DoctorServerSchema>;

export async function signUpDoctor(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log("Raw form data:", data);

  let newUserId: string | null = null;

  try {
    // Parse and validate the data
    const validatedData: DoctorServerData = await DoctorServerSchema.parseAsync(
      data
    );
    console.log("Validated data:", validatedData);

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      yearsOfExperience,
      nationalIdCard,
      consultationFee,
      location,
      availabilityTimes,
      education,
      licenseFileUrl,
    } = validatedData;

    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.error("User already exists");
      return { success: false, message: "L'e-mail est déjà enregistré." };
    }

    // Check if national ID already exists
    const { data: existingNationalId } = await supabase
      .from("users")
      .select("id")
      .eq("national_id_card", nationalIdCard)
      .single();

    if (existingNationalId) {
      return {
        success: false,
        message: "Cette carte d'identité nationale est déjà enregistrée.",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new doctor
    const { data: newDoctor, error: insertError } = await supabase
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        role,
        password: hashedPassword,
        years_of_experience: yearsOfExperience,
        national_id_card: nationalIdCard,
        consultation_fee: consultationFee,
        location,
        license_file_url: licenseFileUrl,
        availability_times: availabilityTimes,
        education,
        verification_status: VERIFICATION_STATUS.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !newDoctor) {
      console.error("Insert error:", insertError);
      return {
        success: false,
        message:
          insertError?.message || "Échec de la création de l'utilisateur.",
      };
    }

    newUserId = newDoctor.id;

    return {
      success: true,
      message: "Compte docteur créé avec succès, en attente de vérification.",
    };
  } catch (error) {
    console.error("Signup error:", error);

    // Rollback user creation if needed
    if (newUserId) {
      console.error("Rolling back user creation...");
      try {
        const supabase = await createClient();
        await supabase.from("users").delete().eq("id", newUserId);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        message: firstError.message || "Données de formulaire invalides.",
      };
    }

    // Handle database errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return {
          success: false,
          message: "Un utilisateur avec ces informations existe déjà.",
        };
      }
    }

    return {
      success: false,
      message: "Une erreur inattendue s'est produite.",
    };
  }
}

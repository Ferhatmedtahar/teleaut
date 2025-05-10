// "use server";

// import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import { sendVerificationEmailTeacher } from "@/app/(auth)/_lib/email/sendApprovaleEmailTeacher";
// import { generateToken } from "@/app/(auth)/_lib/generateToken";
// import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
// import { createClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";

// export async function approveTeacher(formData: FormData) {
//   const user = await getCurrentUser();

//   if (!user || user.role !== "admin") {
//     return {
//       success: false,
//       message: "You are not authorized to perform this action",
//     };
//   }

//   const teacherId = formData.get("teacherId") as string;
//   const email = formData.get("email") as string;
//   const verify = formData.get("verify") === "true";
//   const token = await generateToken({ id: teacherId, role: "teacher" });
//   if (!teacherId) {
//     return { success: false, message: "Teacher ID is required" };
//   }

//   const { emailSent } = await sendVerificationEmailTeacher(
//     teacherId,
//     email,
//     token
//   );
//   if (!emailSent) {
//     return { success: false, message: "Failed to send verification email" };
//   }

//   const supabase = await createClient();
//   const { error } = await supabase
//     .from("users")
//     .update({ verification_status: verify && VERIFICATION_STATUS.EMAIL_SENT })
//     .eq("id", teacherId)
//     .eq("role", "teacher");

//   if (error) {
//     console.error("Error updating teacher verification status:", error);
//     return { success: false, message: "Failed to update verification status" };
//   }

//   revalidatePath(`/admin/teachers/${teacherId}`);
//   revalidatePath("/admin/unverified");
//   revalidatePath("/admin");

//   return { success: true, message: "Approval email sent successfully" };
// }

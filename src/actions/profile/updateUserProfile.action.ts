"use server";

import { uploadFile } from "@/lib/helpers/uploadFile";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  try {
    const userRole = formData.get("role") as string;
    if (!userRole) {
      return { success: false, message: "Échec de la mise à jour du profil" };
    }
    //get the previous data sent within the form
    const prev_bio = formData.get("prev_bio") as string;
    if (userRole == roles.patient) {
    }

    //get the values
    const bio = formData.get("bio") as string;
    const userId = formData.get("userId") as string;

    const profileImage = formData.get("profileImage") as File;
    const backgroundImage = formData.get("backgroundImage") as File;

    const removeProfileImage = formData.get("removeProfileImage") as string;
    const removeBackgroundImage = formData.get(
      "removeBackgroundImage"
    ) as string;

    const supabase = await createClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, profile_url, background_url")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    let profile: string = "";
    let background: string = "";

    const updateObject: {
      bio: string;
      profile_url?: string | null;
      background_url?: string | null;
      class?: string;
      branch?: string;
    } = {
      bio,
    };

    if (removeProfileImage === "true") {
      updateObject.profile_url = null;
      // Delete record in user_files if needed
      const { error: deleteError } = await supabase
        .from("user_files")
        .delete()
        .eq("user_id", userId)
        .eq("file_type", "profile_picture");

      if (deleteError) {
        console.error("Error deleting profile file record:", deleteError);
      }
    }

    if (removeBackgroundImage === "true") {
      updateObject.background_url = null;
      const { error: deleteError } = await supabase
        .from("user_files")
        .delete()
        .eq("user_id", userId)
        .eq("file_type", "cover_picture");

      if (deleteError) {
        console.error("Error deleting profile file record:", deleteError);
      }
    }
    if (profileImage && existingUser.profile_url) {
      const { error: deleteError } = await supabase
        .from("user_files")
        .delete()
        .eq("user_id", userId)
        .eq("file_type", "profile_picture");
      if (deleteError) {
        console.error("Error deleting profile file record:", deleteError);
      }
    }
    if (backgroundImage && existingUser.background_url) {
      const { error: deleteError } = await supabase
        .from("user_files")
        .delete()
        .eq("user_id", userId)
        .eq("file_type", "cover_picture");
      if (deleteError) {
        console.error("Error deleting profile file record:", deleteError);
      }
    }

    const uploadsArray = [];
    if (profileImage) {
      uploadsArray.push(uploadFile(profileImage, "profile_picture", userId));
    }
    if (backgroundImage) {
      uploadsArray.push(uploadFile(backgroundImage, "cover_picture", userId));
    }

    const uploadsUrls = await Promise.all(uploadsArray);

    uploadsUrls.forEach((url) => {
      if (url.includes("profiles/profile-pictures")) {
        profile = url;
      } else if (url.includes("profiles/cover-pictures")) {
        background = url;
      }
    });

    if (profile) {
      updateObject.profile_url = profile;
    }
    if (background) {
      updateObject.background_url = background;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(updateObject)
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { success: false, message: "Échec de la mise à jour du profil" };
    }

    revalidatePath("/profile");

    return { success: true, message: "Profil mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Échec de la mise à jour du profil" };
  }
}

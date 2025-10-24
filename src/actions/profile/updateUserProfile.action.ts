"use server";

import { deleteFile, uploadFile } from "@/lib/helpers/uploadFile";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  try {
    console.log("Updating user profile...", formData);
    const userRole = formData.get("role") as string;
    if (!userRole) {
      return { success: false, message: "Échec de la mise à jour du profil" };
    }

    const bio = formData.get("bio") as string;
    const userId = formData.get("userId") as string;

    const profileImage = formData.get("profileImage") as File | null;
    const backgroundImage = formData.get("backgroundImage") as File | null;

    const removeProfileImage = formData.get("removeProfileImage") === "true";
    const removeBackgroundImage =
      formData.get("removeBackgroundImage") === "true";

    const supabase = await createClient();

    // Fetch existing user data
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, profile_url, background_url")
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    const updateObject: {
      bio: string;
      profile_url?: string | null;
      background_url?: string | null;
    } = {
      bio,
    };

    // Handle profile image removal
    if (removeProfileImage && existingUser.profile_url) {
      try {
        await deleteFile(existingUser.profile_url, userId, "profile_picture");
        updateObject.profile_url = null;
      } catch (error) {
        console.error("Error removing profile image:", error);
        // Continue with the update even if deletion fails
        updateObject.profile_url = null;
      }
    }

    // Handle background image removal
    if (removeBackgroundImage && existingUser.background_url) {
      try {
        await deleteFile(existingUser.background_url, userId, "cover_picture");
        updateObject.background_url = null;
      } catch (error) {
        console.error("Error removing background image:", error);
        // Continue with the update even if deletion fails
        updateObject.background_url = null;
      }
    }

    // Handle profile image replacement (delete old, upload new)
    if (profileImage && profileImage.size > 0) {
      // Delete old profile image if exists
      if (existingUser.profile_url) {
        try {
          await deleteFile(existingUser.profile_url, userId, "profile_picture");
        } catch (error) {
          console.error("Error deleting old profile image:", error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new profile image
      try {
        const newProfileUrl = await uploadFile(
          profileImage,
          "profile_picture",
          userId
        );
        updateObject.profile_url = newProfileUrl;
      } catch (error) {
        console.error("Error uploading profile image:", error);
        return {
          success: false,
          message: "Échec du téléchargement de l'image de profil",
        };
      }
    }

    // Handle background image replacement (delete old, upload new)
    if (backgroundImage && backgroundImage.size > 0) {
      // Delete old background image if exists
      if (existingUser.background_url) {
        try {
          await deleteFile(
            existingUser.background_url,
            userId,
            "cover_picture"
          );
        } catch (error) {
          console.error("Error deleting old background image:", error);
        }
      }

      // Upload new background image
      try {
        const newBackgroundUrl = await uploadFile(
          backgroundImage,
          "cover_picture",
          userId
        );
        updateObject.background_url = newBackgroundUrl;
      } catch (error) {
        console.error("Error uploading background image:", error);
        return {
          success: false,
          message: "Échec du téléchargement de l'image d'arrière-plan",
        };
      }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(updateObject)
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { success: false, message: "Échec de la mise à jour du profil" };
    }

    // Revalidate the profile page cache
    revalidatePath("/profile");

    return { success: true, message: "Profil mis à jour avec succès" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Échec de la mise à jour du profil" };
  }
}

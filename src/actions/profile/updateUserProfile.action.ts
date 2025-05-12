"use server";

import { uploadFile } from "@/app/(auth)/_lib/uploadFile";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  // 1. Get the current user ID from your auth system.
  // 2.get the values based on the role.
  // 3.call api and updload the images to bunny.
  // 4. Update the user record and urls.
  //if error return { success: false, error: "Failed to update profile" };
  //if success return { success: true , message: "Profile updated successfully" };
  try {
    const userRole = formData.get("role") as string;
    let prev_class: string = "";
    let prev_branch: string = "";

    if (!userRole) {
      return { success: false, message: "Failed to update profile" };
    }
    //get the previous data sent within the form
    const prev_bio = formData.get("prev_bio") as string;
    if (userRole == roles.student) {
      prev_class = formData.get("prev_class") as string;
      prev_branch = formData.get("prev_branch") as string;
    }

    //get the values
    const bio = formData.get("bio") as string;
    const userId = formData.get("userId") as string;
    const classValue = formData.get("class") as string;
    const branch = formData.get("branch") as string;
    const profileImage = formData.get("profileImage") as File;
    const backgroundImage = formData.get("backgroundImage") as File;

    console.log("Updating profile with:", {
      bio,
      profileImage: profileImage,
      backgroundImage: backgroundImage,
      class: classValue,
      branch,
    });

    // if (userRole == roles.student && (!classValue || !branch)) {

    //   return { success: false, message: "Failed to update profile" };
    // }

    // if (
    //   !profileImage &&
    //   !backgroundImage &&
    //   bio == prev_bio &&
    //   classValue === prev_class &&
    //   branch == prev_branch
    // ) {
    //   return { success: false, message: "Failed to update profile" };
    // }

    const uploadsArray = [];
    if (profileImage) {
      uploadsArray.push(uploadFile(profileImage, "profile_picture", userId));
    }
    if (backgroundImage) {
      uploadsArray.push(uploadFile(backgroundImage, "cover_picture", userId));
    }

    const uploadsUrls = await Promise.all(uploadsArray);

    console.log("uploads", uploadsUrls);

    const supabase = await createClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        bio,
        profile_url: uploadsUrls[0],
        background_url: uploadsUrls[1],
        class: classValue,
        branch,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { success: false, message: "Failed to update profile" };
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

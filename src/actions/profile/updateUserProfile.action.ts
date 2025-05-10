"use server";

import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  // 1. Get the current user ID from your auth system.
  // 2.get the values based on the role.
  // 3.call api and updload the images to bunny.
  // 4. Update the user record and urls.
  //if error return { success: false, error: "Failed to update profile" };
  //if success return { success: true , message: "Profile updated successfully" };
  try {
    const bio = formData.get("bio") as string;
    const profileImage = formData.get("profileImage") as File;
    const backgroundImage = formData.get("backgroundImage") as File;
    const classValue = formData.get("class") as string;
    const branch = formData.get("branch") as string;

    console.log("Updating profile with:", {
      bio,
      hasProfileImage: !!profileImage,
      hasBackgroundImage: !!backgroundImage,
      class: classValue,
      branch,
    });

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

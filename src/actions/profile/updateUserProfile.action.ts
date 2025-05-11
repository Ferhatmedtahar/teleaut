"use server";

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
      return { success: false, error: "Failed to update profile" };
    }
    //get the previous data sent within the form
    const prev_bio = formData.get("prev_bio") as string;
    if (userRole == roles.student) {
      prev_class = formData.get("prev_class") as string;
      prev_branch = formData.get("prev_branch") as string;
    }

    //get the values
    const bio = formData.get("bio") as string;
    const classValue = formData.get("class") as string;
    const branch = formData.get("branch") as string;

    if (!bio || !classValue || !branch) {
      return { success: false, error: "Failed to update profile" };
    }
    if (userRole == roles.student && (!classValue || !branch)) {
      return { success: false, error: "Failed to update profile" };
    }

    if (bio == prev_bio && classValue === prev_class && branch == prev_branch) {
      return { success: false, error: "Failed to update profile" };
    }

    const profileImage = formData.get("profileImage") as File;
    const backgroundImage = formData.get("backgroundImage") as File;

    console.log("Updating profile with:", {
      bio,
      profileImage: profileImage,
      backgroundImage: backgroundImage,
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

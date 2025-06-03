"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get user's rating for a video
export async function getUserRating(videoId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, data: null, message: "Not authenticated" };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return { success: false, data: null, message: "Invalid token" };
  }

  const supabase = await createClient();
  const userId = decoded.id;

  const { data, error } = await supabase
    .from("video_reviews")
    .select("rating")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: true, data: null, message: "No rating found" };
    }
    console.error("Error fetching user rating:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch rating",
    };
  }

  return { success: true, data: data.rating, message: "Fetched rating" };
}

// Set/update user rating for a video
export async function setVideoRating(videoId: string, rating: number) {
  console.log("Setting video rating:", videoId, rating);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: { averageRating: 0, totalRatings: 0 },
    };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return {
      success: false,
      message: "Invalid token",
      data: { averageRating: 0, totalRatings: 0 },
    };
  }

  // Validate rating range (1-5 in 0.5 increments)
  if (rating < 1 || rating > 5 || (rating * 2) % 1 !== 0) {
    return {
      success: false,
      message: "Rating must be between 1 and 5 in 0.5 increments",
      data: { averageRating: 0, totalRatings: 0 },
    };
  }

  const supabase = await createClient();
  const userId = decoded.id;

  // Check if user already rated this video
  const { data: existingRating, error: fetchError } = await supabase
    .from("video_reviews")
    .select("*")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking existing rating:", fetchError);
    const stats = await getVideoRatingStats(videoId);
    return {
      success: false,
      message: "Failed to check existing rating",
      data: stats.data,
    };
  }

  let result;

  if (existingRating) {
    // Update existing rating
    result = await supabase
      .from("video_reviews")
      .update({ rating, updated_at: new Date().toISOString() })
      .eq("id", existingRating.id);
  } else {
    // Insert new rating
    result = await supabase.from("video_reviews").insert({
      video_id: videoId,
      user_id: userId,
      rating,
    });
  }

  if (result.error) {
    console.error("Error setting rating:", result.error);
    const stats = await getVideoRatingStats(videoId);
    return {
      success: false,
      message: "Failed to update rating",
      data: stats.data,
    };
  }

  // Get updated rating stats
  const updatedStats = await getVideoRatingStats(videoId);

  revalidatePath(`/videos/${videoId}`);
  return {
    success: true,
    message: "Rating submitted successfully",
    data: updatedStats.data,
  };
}

// Delete user's rating for a video
export async function deleteVideoRating(videoId: string) {
  console.log("Deleting video rating:", videoId);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: { averageRating: 0, totalRatings: 0 },
    };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return {
      success: false,
      message: "Invalid token",
      data: { averageRating: 0, totalRatings: 0 },
    };
  }

  const supabase = await createClient();
  const userId = decoded.id;

  // Check if user has a rating for this video
  const { data: existingRating, error: fetchError } = await supabase
    .from("video_reviews")
    .select("id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      const stats = await getVideoRatingStats(videoId);
      return {
        success: false,
        message: "No rating found to delete",
        data: stats.data,
      };
    }
    console.error("Error checking existing rating:", fetchError);
    const stats = await getVideoRatingStats(videoId);
    return {
      success: false,
      message: "Failed to check existing rating",
      data: stats.data,
    };
  }

  // Delete the rating
  const { error: deleteError } = await supabase
    .from("video_reviews")
    .delete()
    .eq("id", existingRating.id);

  if (deleteError) {
    console.error("Error deleting rating:", deleteError);
    const stats = await getVideoRatingStats(videoId);
    return {
      success: false,
      message: "Failed to delete rating",
      data: stats.data,
    };
  }

  // Get updated rating stats
  const updatedStats = await getVideoRatingStats(videoId);

  revalidatePath(`/videos/${videoId}`);
  return {
    success: true,
    message: "Rating deleted successfully",
    data: updatedStats.data,
  };
}

// Get video rating statistics
export async function getVideoRatingStats(videoId: string) {
  const supabase = await createClient();

  const { data: ratings, error } = await supabase
    .from("video_reviews")
    .select("rating")
    .eq("video_id", videoId);

  if (error) {
    console.error("Error fetching rating stats:", error);
    return {
      success: false,
      data: { averageRating: 0, totalRatings: 0 },
      message: "Failed to fetch rating stats",
    };
  }

  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  return {
    success: true,
    data: {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings,
    },
    message: "Fetched rating stats",
  };
}

// Get detailed rating breakdown (for analytics/admin)
export async function getVideoRatingBreakdown(videoId: string) {
  const supabase = await createClient();

  const { data: ratings, error } = await supabase
    .from("video_reviews")
    .select("rating")
    .eq("video_id", videoId);

  if (error) {
    console.error("Error fetching rating breakdown:", error);
    return {
      success: false,
      data: {},
      message: "Failed to fetch rating breakdown",
    };
  }

  // Count ratings by star value (1-5 in 0.5 increments)
  const breakdown = {
    5: 0,
    4.5: 0,
    4: 0,
    3.5: 0,
    3: 0,
    2.5: 0,
    2: 0,
    1.5: 0,
    1: 0,
  };

  ratings.forEach((r) => {
    breakdown[r.rating as keyof typeof breakdown]++;
  });

  return {
    success: true,
    data: breakdown,
    message: "Fetched rating breakdown",
  };
}
// "use server";

// import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
// import { createClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// // Get user's rating for a video
// export async function getUserRating(videoId: string) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return { success: false, data: null, message: "Not authenticated" };
//   }

//   const decoded = await verifyToken(token);
//   if (!decoded || !decoded.id) {
//     return { success: false, data: null, message: "Invalid token" };
//   }

//   const supabase = await createClient();
//   const userId = decoded.id;

//   const { data, error } = await supabase
//     .from("video_reviews")
//     .select("rating")
//     .eq("video_id", videoId)
//     .eq("user_id", userId)
//     .single();

//   if (error) {
//     if (error.code === "PGRST116") {
//       return { success: true, data: null, message: "No rating found" };
//     }
//     console.error("Error fetching user rating:", error);
//     return {
//       success: false,
//       data: null,
//       message: "Failed to fetch rating",
//     };
//   }

//   return { success: true, data: data.rating, message: "Fetched rating" };
// }

// // Set/update user rating for a video
// export async function setVideoRating(videoId: string, rating: number) {
//   console.log("Setting video rating:", videoId, rating);
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return {
//       success: false,
//       message: "Not authenticated",
//       data: { averageRating: 0, totalRatings: 0 },
//     };
//   }

//   const decoded = await verifyToken(token);
//   if (!decoded || !decoded.id) {
//     return {
//       success: false,
//       message: "Invalid token",
//       data: { averageRating: 0, totalRatings: 0 },
//     };
//   }

//   // Validate rating range (1-5 in 0.5 increments)
//   if (rating < 1 || rating > 5 || (rating * 2) % 1 !== 0) {
//     return {
//       success: false,
//       message: "Rating must be between 1 and 5 in 0.5 increments",
//       data: { averageRating: 0, totalRatings: 0 },
//     };
//   }

//   const supabase = await createClient();
//   const userId = decoded.id;

//   // Check if user already rated this video
//   const { data: existingRating, error: fetchError } = await supabase
//     .from("video_reviews")
//     .select("*")
//     .eq("video_id", videoId)
//     .eq("user_id", userId)
//     .single();

//   if (fetchError && fetchError.code !== "PGRST116") {
//     console.error("Error checking existing rating:", fetchError);
//     const stats = await getVideoRatingStats(videoId);
//     return {
//       success: false,
//       message: "Failed to check existing rating",
//       data: stats.data,
//     };
//   }

//   let result;

//   if (existingRating) {
//     // Update existing rating
//     result = await supabase
//       .from("video_reviews")
//       .update({ rating, updated_at: new Date().toISOString() })
//       .eq("id", existingRating.id);
//   } else {
//     // Insert new rating
//     result = await supabase.from("video_reviews").insert({
//       video_id: videoId,
//       user_id: userId,
//       rating,
//     });
//   }

//   if (result.error) {
//     console.error("Error setting rating:", result.error);
//     const stats = await getVideoRatingStats(videoId);
//     return {
//       success: false,
//       message: "Failed to update rating",
//       data: stats.data,
//     };
//   }

//   // Get updated rating stats
//   const updatedStats = await getVideoRatingStats(videoId);

//   revalidatePath(`/videos/${videoId}`);
//   return {
//     success: true,
//     message: "Rating submitted successfully",
//     data: updatedStats.data,
//   };
// }

// // Get video rating statistics
// export async function getVideoRatingStats(videoId: string) {
//   const supabase = await createClient();

//   const { data: ratings, error } = await supabase
//     .from("video_reviews")
//     .select("rating")
//     .eq("video_id", videoId);

//   if (error) {
//     console.error("Error fetching rating stats:", error);
//     return {
//       success: false,
//       data: { averageRating: 0, totalRatings: 0 },
//       message: "Failed to fetch rating stats",
//     };
//   }

//   const totalRatings = ratings.length;
//   const averageRating =
//     totalRatings > 0
//       ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
//       : 0;

//   return {
//     success: true,
//     data: {
//       averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
//       totalRatings,
//     },
//     message: "Fetched rating stats",
//   };
// }

// // Get detailed rating breakdown (for analytics/admin)
// export async function getVideoRatingBreakdown(videoId: string) {
//   const supabase = await createClient();

//   const { data: ratings, error } = await supabase
//     .from("video_reviews")
//     .select("rating")
//     .eq("video_id", videoId);

//   if (error) {
//     console.error("Error fetching rating breakdown:", error);
//     return {
//       success: false,
//       data: {},
//       message: "Failed to fetch rating breakdown",
//     };
//   }

//   // Count ratings by star value (1-5 in 0.5 increments)
//   const breakdown = {
//     5: 0,
//     4.5: 0,
//     4: 0,
//     3.5: 0,
//     3: 0,
//     2.5: 0,
//     2: 0,
//     1.5: 0,
//     1: 0,
//   };

//   ratings.forEach((r) => {
//     breakdown[r.rating as keyof typeof breakdown]++;
//   });

//   return {
//     success: true,
//     data: breakdown,
//     message: "Fetched rating breakdown",
//   };
// }
// // "use server";

// // import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
// // import { createClient } from "@/lib/supabase/server";
// // import { revalidatePath } from "next/cache";
// // import { cookies } from "next/headers";

// // // Get user's rating for a video
// // export async function getUserRating(videoId: string) {
// //   const cookieStore = await cookies();
// //   const token = cookieStore.get("token")?.value;

// //   if (!token) {
// //     return { success: false, data: null, message: "Not authenticated" };
// //   }

// //   const decoded = await verifyToken(token);
// //   if (!decoded || !decoded.id) {
// //     return { success: false, data: null, message: "Invalid token" };
// //   }

// //   const supabase = await createClient();
// //   const userId = decoded.id;

// //   const { data, error } = await supabase
// //     .from("video_ratings")
// //     .select("rating")
// //     .eq("video_id", videoId)
// //     .eq("user_id", userId)
// //     .single();

// //   if (error) {
// //     if (error.code === "PGRST116") {
// //       return { success: true, data: null, message: "No rating found" };
// //     }
// //     console.error("Error fetching user rating:", error);
// //     return {
// //       success: false,
// //       data: null,
// //       message: "Failed to fetch rating",
// //     };
// //   }

// //   return { success: true, data: data.rating, message: "Fetched rating" };
// // }

// // // Set/update user rating for a video
// // export async function setVideoRating(videoId: string, rating: number) {
// //   const cookieStore = await cookies();
// //   const token = cookieStore.get("token")?.value;

// //   if (!token) {
// //     return {
// //       success: false,
// //       message: "Not authenticated",
// //       data: { averageRating: 0, totalRatings: 0 },
// //     };
// //   }

// //   const decoded = await verifyToken(token);
// //   if (!decoded || !decoded.id) {
// //     return {
// //       success: false,
// //       message: "Invalid token",
// //       data: { averageRating: 0, totalRatings: 0 },
// //     };
// //   }

// //   // Validate rating range
// //   if (rating < 0.5 || rating > 5 || (rating * 2) % 1 !== 0) {
// //     return {
// //       success: false,
// //       message: "Rating must be between 0.5 and 5 in 0.5 increments",
// //       data: { averageRating: 0, totalRatings: 0 },
// //     };
// //   }

// //   const supabase = await createClient();
// //   const userId = decoded.id;

// //   // Check if user already rated this video
// //   const { data: existingRating, error: fetchError } = await supabase
// //     .from("video_ratings")
// //     .select("*")
// //     .eq("video_id", videoId)
// //     .eq("user_id", userId)
// //     .single();

// //   if (fetchError && fetchError.code !== "PGRST116") {
// //     console.error("Error checking existing rating:", fetchError);
// //     const stats = await getVideoRatingStats(videoId);
// //     return {
// //       success: false,
// //       message: "Failed to check existing rating",
// //       data: stats.data,
// //     };
// //   }

// //   let result;

// //   if (existingRating) {
// //     if (existingRating.rating === rating) {
// //       // Remove rating if user clicks the same star
// //       result = await supabase
// //         .from("video_ratings")
// //         .delete()
// //         .eq("id", existingRating.id);
// //     } else {
// //       // Update existing rating
// //       result = await supabase
// //         .from("video_ratings")
// //         .update({ rating, updated_at: new Date().toISOString() })
// //         .eq("id", existingRating.id);
// //     }
// //   } else {
// //     // Insert new rating
// //     result = await supabase.from("video_ratings").insert({
// //       video_id: videoId,
// //       user_id: userId,
// //       rating,
// //     });
// //   }

// //   if (result.error) {
// //     console.error("Error setting rating:", result.error);
// //     const stats = await getVideoRatingStats(videoId);
// //     return {
// //       success: false,
// //       message: "Failed to update rating",
// //       data: stats.data,
// //     };
// //   }

// //   // Get updated rating stats
// //   const updatedStats = await getVideoRatingStats(videoId);

// //   revalidatePath(`/videos/${videoId}`);
// //   return {
// //     success: true,
// //     message: "Rating updated",
// //     data: updatedStats.data,
// //   };
// // }

// // // Get video rating statistics
// // export async function getVideoRatingStats(videoId: string) {
// //   const supabase = await createClient();

// //   const { data: ratings, error } = await supabase
// //     .from("video_ratings")
// //     .select("rating")
// //     .eq("video_id", videoId);

// //   if (error) {
// //     console.error("Error fetching rating stats:", error);
// //     return {
// //       success: false,
// //       data: { averageRating: 0, totalRatings: 0 },
// //       message: "Failed to fetch rating stats",
// //     };
// //   }

// //   const totalRatings = ratings.length;
// //   const averageRating =
// //     totalRatings > 0
// //       ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
// //       : 0;

// //   return {
// //     success: true,
// //     data: {
// //       averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
// //       totalRatings,
// //     },
// //     message: "Fetched rating stats",
// //   };
// // }

// // // Get detailed rating breakdown (for analytics/admin)
// // export async function getVideoRatingBreakdown(videoId: string) {
// //   const supabase = await createClient();

// //   const { data: ratings, error } = await supabase
// //     .from("video_ratings")
// //     .select("rating")
// //     .eq("video_id", videoId);

// //   if (error) {
// //     console.error("Error fetching rating breakdown:", error);
// //     return {
// //       success: false,
// //       data: {},
// //       message: "Failed to fetch rating breakdown",
// //     };
// //   }

// //   // Count ratings by star value
// //   const breakdown = {
// //     5: 0,
// //     4.5: 0,
// //     4: 0,
// //     3.5: 0,
// //     3: 0,
// //     2.5: 0,
// //     2: 0,
// //     1.5: 0,
// //     1: 0,
// //     0.5: 0,
// //   };

// //   ratings.forEach((r) => {
// //     breakdown[r.rating as keyof typeof breakdown]++;
// //   });

// //   return {
// //     success: true,
// //     data: breakdown,
// //     message: "Fetched rating breakdown",
// //   };
// // }
// // // "use server";

// // // import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
// // // import { createClient } from "@/lib/supabase/server";
// // // import { revalidatePath } from "next/cache";
// // // import { cookies } from "next/headers";

// // // // Get user's like status for a video
// // // export async function getUserLikeStatus(videoId: string) {
// // //   const cookieStore = await cookies();
// // //   const token = cookieStore.get("token")?.value;

// // //   if (!token) {
// // //     return { success: false, data: null, message: "Not authenticated" };
// // //   }

// // //   const decoded = await verifyToken(token);
// // //   if (!decoded || !decoded.id) {
// // //     return { success: false, data: null, message: "Invalid token" };
// // //   }

// // //   const supabase = await createClient();
// // //   const userId = decoded.id;

// // //   const { data, error } = await supabase
// // //     .from("video_likes")
// // //     .select("is_like")
// // //     .eq("video_id", videoId)
// // //     .eq("user_id", userId)
// // //     .single();

// // //   if (error) {
// // //     if (error.code === "PGRST116") {
// // //       return { success: true, data: null, message: "No like status found" };
// // //     }
// // //     console.error("Error fetching user like status:", error);
// // //     return {
// // //       success: false,
// // //       data: null,
// // //       message: "Failed to fetch like status",
// // //     };
// // //   }

// // //   return { success: true, data: data.is_like, message: "Fetched like status" };
// // // }

// // // // Toggle like/dislike
// // // export async function toggleVideoLike(videoId: string, isLike: boolean) {
// // //   const cookieStore = await cookies();
// // //   const token = cookieStore.get("token")?.value;

// // //   if (!token) {
// // //     return { success: false, message: "Not authenticated" };
// // //   }

// // //   const decoded = await verifyToken(token);
// // //   if (!decoded || !decoded.id) {
// // //     return { success: false, message: "Invalid token" };
// // //   }

// // //   const supabase = await createClient();
// // //   const userId = decoded.id;

// // //   // Check if user already liked/disliked
// // //   const { data: existingLike, error: fetchError } = await supabase
// // //     .from("video_likes")
// // //     .select("*")
// // //     .eq("video_id", videoId)
// // //     .eq("user_id", userId)
// // //     .single();

// // //   if (fetchError && fetchError.code !== "PGRST116") {
// // //     console.error("Error checking existing like:", fetchError);
// // //     return { success: false, message: "Failed to check existing like" };
// // //   }

// // //   let result;

// // //   if (existingLike) {
// // //     if (existingLike.is_like === isLike) {
// // //       // Remove like/dislike
// // //       result = await supabase
// // //         .from("video_likes")
// // //         .delete()
// // //         .eq("id", existingLike.id);
// // //     } else {
// // //       // Update to new like/dislike
// // //       result = await supabase
// // //         .from("video_likes")
// // //         .update({ is_like: isLike })
// // //         .eq("id", existingLike.id);
// // //     }
// // //   } else {
// // //     // Insert new like/dislike
// // //     result = await supabase.from("video_likes").insert({
// // //       video_id: videoId,
// // //       user_id: userId,
// // //       is_like: isLike,
// // //     });
// // //   }

// // //   if (result.error) {
// // //     console.error("Error toggling like:", result.error);
// // //     return { success: false, message: "Failed to update like status" };
// // //   }

// // //   revalidatePath(`/videos/${videoId}`);
// // //   return { success: true, message: "Like status updated" };
// // // }

// // // // Get video likes count
// // // export async function getVideoLikesCount(videoId: string) {
// // //   const supabase = await createClient();

// // //   const { count: likesCount, error: likesError } = await supabase
// // //     .from("video_likes")
// // //     .select("*", { count: "exact", head: true })
// // //     .eq("video_id", videoId)
// // //     .eq("is_like", true);

// // //   const { count: dislikesCount, error: dislikesError } = await supabase
// // //     .from("video_likes")
// // //     .select("*", { count: "exact", head: true })
// // //     .eq("video_id", videoId)
// // //     .eq("is_like", false);

// // //   if (likesError || dislikesError) {
// // //     console.error("Error fetching likes count:", likesError || dislikesError);
// // //     return {
// // //       success: false,
// // //       data: { likes: 0, dislikes: 0 },
// // //       message: "Failed to fetch likes count",
// // //     };
// // //   }

// // //   return {
// // //     success: true,
// // //     data: { likes: likesCount ?? 0, dislikes: dislikesCount ?? 0 },
// // //   };
// // // }

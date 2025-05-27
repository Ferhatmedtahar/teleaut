import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getHistory } from "@/actions/history/GetHistory.action";
import { redirect } from "next/navigation";
import WatchHistory from "./_components/WatchHistory";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

export default async function Page() {
  const { success, user } = await getCurrentUser();
  if (!success || !user) return redirect("/sign-in");

  const { data: watchedVideos }: { data: RelatedVideo[] } = await getHistory(
    user.id
  );
  return <WatchHistory watchedVideos={watchedVideos} />;
}

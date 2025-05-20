import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getHistory } from "@/actions/history/GetHistory.action";
import { redirect } from "next/navigation";
import WatchHistory from "./_components/WatchHistory";

export default async function Page() {
  const { success, user } = await getCurrentUser();
  if (!success || !user) return redirect("/sign-in");

  const { data: watchedVideos } = await getHistory(user.id);
  return <WatchHistory watchedVideos={watchedVideos} />;
}

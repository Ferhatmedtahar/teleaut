import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getHistory } from "@/actions/history/GetHistory.action";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { redirect } from "next/navigation";
import WatchHistory from "./_components/WatchHistory";
export const metadata = {
  title: "Historique de visionnage",
  description:
    "Consultez les vidéos que vous avez récemment regardées. Recherchez par titre pour retrouver rapidement ce que vous cherchez.",
};
export default async function Page() {
  const { success, user } = await getCurrentUser();
  if (!success || !user) return redirect("/sign-in");

  const { data: watchedVideos }: { data: RelatedVideo[] } = await getHistory(
    user.id
  );
  return <WatchHistory watchedVideos={watchedVideos} />;
}

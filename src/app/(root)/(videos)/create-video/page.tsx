import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getCurrentUserById } from "@/actions/profile/getCurrentUserById.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import VideoUploadForm from "../_components/forms/VideoUploadForm";

export const metadata = {
  title: "Ajouter une video",
  description: "Ajouter une video",
};
export default async function UploadVideoPage() {
  const { user } = await getCurrentUser();
  if (user?.role !== roles.teacher) return redirect("/");
  const result = await getCurrentUserById();
  const { user: currentUser } = result;
  return (
    <div className=" mx-auto p-8">
      <VideoUploadForm
        userId={currentUser.id}
        userSpecialties={currentUser.specialties}
      />
    </div>
  );
}

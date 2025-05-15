import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import VideoUploadForm from "../_components/VideoUploadForm";

export default async function UploadVideoPage() {
  const { user } = await getCurrentUser();
  if (user?.role !== roles.teacher) return redirect("/");
  return (
    <div className=" mx-auto p-8">
      <VideoUploadForm />
    </div>
  );
}

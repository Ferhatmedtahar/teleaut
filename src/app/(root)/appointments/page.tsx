import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getCurrentUserById } from "@/actions/profile/getCurrentUserById.action";
import { roles } from "@/types/roles.enum";
// import FeaturedVideoUploadForm from "../_components/forms/AdminVideoUploadForm";
// import VideoUploadForm from "../_components/forms/VideoUploadForm";

export const metadata = {
  title: "Ajouter une video",
  description: "Ajouter une video",
};
export default async function UploadVideoPage() {
  const { user } = await getCurrentUser();

  // if (user?.role == roles.patient) return redirect("/");
  const result = await getCurrentUserById();
  const { user: currentUser } = result;

  if (user?.role == roles.admin) {
    return (
      <div className=" mx-auto p-8">
        {/* <FeaturedVideoUploadForm userId={currentUser.id} /> */}
      </div>
    );
  }

  return <div className=" mx-auto p-8"></div>;
}

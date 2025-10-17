import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getDoctorsList } from "@/actions/home/getDoctors.action";
import GuestHomePage from "@/components/home/GuestHomePage";
import HomePage from "@/components/home/HomePage";

export default async function Page() {
  const result = await getCurrentUser();
  const { doctors } = await getDoctorsList();
  const isAuthenticated = result.success && result.user;
  if (!isAuthenticated) {
    return <GuestHomePage doctors={doctors || []} />;
  }

  return <HomePage />;
}

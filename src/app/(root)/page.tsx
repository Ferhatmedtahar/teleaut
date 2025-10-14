import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import GuestHomePage from "@/components/home/GuestHomePage";
import HomePage from "@/components/home/HomePage";

export default async function Page() {
  const result = await getCurrentUser();
  const isAuthenticated = result.success && result.user;
  if (!isAuthenticated) {
    return <GuestHomePage />;
  }

  return <HomePage />;
}

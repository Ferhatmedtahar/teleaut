import { getUserById } from "@/actions/profile/getUserById.action";
import ErrorProfile from "./_components/ErrorProfile";

async function ProfileContent() {
  const { user, success } = await getUserById();
  if (!success) return <ErrorProfile />;
  return (
    <>
      {/* <StatsCards stats={stats} /> */}
      {/* <UserChart stats={stats} /> */}
    </>
  );
}
export default async function UserProfilePage() {
  return <div></div>;
}

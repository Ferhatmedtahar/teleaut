"use client";

import { useUser } from "@/providers/UserProvider";

export default function page() {
  const userid = useUser();
  return (
    <div>
      page profile {userid?.id} and his role {userid?.role}
    </div>
  );
}

"use client";

import { Button } from "@/components/common/buttons/Button";
import { roles } from "@/types/roles.enum";
import { Settings } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface EditProfileButtonProps {
  readonly userId: string;
  readonly currentUserId: string;
  readonly userRole: roles.admin | roles.student | roles.teacher;
  readonly userData: {
    first_name: string;
    last_name: string;
    bio: string;
    profile_url: string;
    background_url: string;
    class?: string;
    branch?: string;
  };
}

export default function EditProfileButton({
  userId,
  currentUserId,
  userRole,
  userData,
}: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show edit button if the current user is viewing their own profile
  if (userId !== currentUserId) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 rounded-full"
        onClick={() => setIsModalOpen(true)}
        aria-label="Edit profile"
      >
        <Settings className="h-5 w-5 text-gray-700" />
      </Button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userRole={userRole}
        userData={userData}
      />
    </>
  );
}

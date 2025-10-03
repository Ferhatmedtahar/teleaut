"use client";

import type React from "react";

import { updateUserProfile } from "@/actions/profile/updateUserProfile.action";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { roles } from "@/types/roles.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface EditProfileModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userRole: roles.admin | roles.patient | roles.doctor;
  readonly userId: string;
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

const editProfileSchema = z.object({
  bio: z.string().optional(),
  class: z.string().optional(),
  branch: z.string().optional(),
});

type EditProfileSchema = z.infer<typeof editProfileSchema>;

export default function EditProfileModal({
  isOpen,
  onClose,
  userRole,
  userData,
  userId,
}: EditProfileModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  // File states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  // New state to track if the user wants to remove their images
  const [removeProfileImage, setRemoveProfileImage] = useState<boolean>(false);
  const [removeBackgroundImage, setRemoveBackgroundImage] =
    useState<boolean>(false);

  // File input refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Class and branch states for students
  const [selectedClass, setSelectedClass] = useState<string>(
    userData?.class ?? ""
  );
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>(
    userData?.branch ?? ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: userData.bio ?? "",
      class: userData.class ?? "",
      branch: userData.branch ?? "",
    },
  });

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setRemoveProfileImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image change
  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      setRemoveBackgroundImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing profile image
  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
    setRemoveProfileImage(true);
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  // Handle removing background image
  const handleRemoveBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundPreview(null);
    setRemoveBackgroundImage(true);
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  };

  // Handle drag and drop for background image
  const handleBackgroundDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setBackgroundImage(file);
      setRemoveBackgroundImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  async function onSubmit(data: EditProfileSchema) {
    try {
      const formData = new FormData();
      formData.append("prev_bio", userData.bio ?? "");
      formData.append("role", userRole);
      formData.append("userId", userId);
      formData.append("bio", data.bio ?? "");

      // Add files if they exist
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (backgroundImage) {
        formData.append("backgroundImage", backgroundImage);
      }

      formData.append("removeProfileImage", removeProfileImage.toString());
      formData.append(
        "removeBackgroundImage",
        removeBackgroundImage.toString()
      );

      if (userRole === roles.patient) {
        if (
          !data.branch &&
          availableBranches.length > 1 &&
          !availableBranches.includes("Aucune filière")
        ) {
          toast.error("Veuillez sélectionner une branche");
          return;
        }
        formData.append("prev_class", userData.class ?? "");
        formData.append("prev_branch", userData.branch ?? "");

        formData.append("class", data.class ?? "");
        formData.append("branch", data.branch ?? "");
      }

      const { success, message } = await updateUserProfile(formData);
      setBackgroundImage(null);
      setProfileImage(null);
      setBackgroundPreview(null);
      setProfilePreview(null);
      setRemoveProfileImage(false);
      setRemoveBackgroundImage(false);

      if (success) {
        toast.success(message);
        reset();
      } else {
        toast.error(message);
      }

      // Close modal and refresh page
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Échec de la mise à jour du profil");
    }
  }

  const watchedBio = watch("bio");
  const watchedClass = watch("class");
  const watchedBranch = watch("branch");

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const isChanged =
      watchedBio !== userData.bio ||
      profileImage !== null ||
      backgroundImage !== null ||
      removeProfileImage ||
      removeBackgroundImage ||
      (userRole === roles.patient &&
        (watchedClass !== userData.class || watchedBranch !== userData.branch));

    setHasChanged(isChanged);
  }, [
    watchedBio,
    watchedClass,
    watchedBranch,
    profileImage,
    backgroundImage,
    removeProfileImage,
    removeBackgroundImage,
    userData,
    userRole,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full  "
        >
          <TabsList className="border-primary-400 dark:border-primary-600 border  dark:bg-primary-950/80  bg-white grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="general" className="text-sm   ">
              General
            </TabsTrigger>
            <TabsTrigger value="images" className="text-sm ">
              Images
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TabsContent value="general" className="space-y-4 mt-0 ">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="resize-none text-sm"
                />
                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio.message}</p>
                )}
              </div>

              {userRole === roles.patient && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Classe</Label>

                    <Input
                      type="hidden"
                      {...register("class")}
                      value={selectedClass}
                    />
                    {errors.class && (
                      <p className="text-xs text-red-500">
                        {errors.class.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Filière</Label>

                    <Input
                      type="hidden"
                      {...register("branch")}
                      value={selectedBranch}
                    />
                    {errors.branch && (
                      <p className="text-xs text-red-500">
                        {errors.branch.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-0">
              {/* Profile Image */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Profile Picture</Label>

                {/* Mobile Layout */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-center justify-center">
                    <Avatar className="h-20 w-20 border-2 border-gray-200">
                      {!removeProfileImage &&
                      (profilePreview || userData.profile_url) ? (
                        <AvatarImage
                          src={profilePreview ?? userData.profile_url}
                          alt="Profile"
                        />
                      ) : (
                        <AvatarFallback className="text-lg">
                          {userData.first_name?.[0]}
                          {userData.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <p className="text-xs text-gray-500 text-center px-2">
                    {removeProfileImage
                      ? "Profile picture will be removed."
                      : userData.profile_url && !profilePreview
                      ? "Current profile picture. Tap below to change."
                      : profilePreview
                      ? "New profile picture selected."
                      : "No profile picture selected."}
                  </p>

                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => profileInputRef.current?.click()}
                      className="text-xs px-3 py-2"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      {(userData.profile_url || profilePreview) &&
                      !removeProfileImage
                        ? "Change"
                        : "Upload"}
                    </Button>

                    {(profilePreview || userData.profile_url) &&
                      !removeProfileImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveProfileImage}
                          className="text-xs px-3 py-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-gray-200 flex-shrink-0">
                    {!removeProfileImage &&
                    (profilePreview || userData.profile_url) ? (
                      <AvatarImage
                        src={profilePreview ?? userData.profile_url}
                        alt="Profile"
                      />
                    ) : (
                      <AvatarFallback>
                        {userData.first_name?.[0]}
                        {userData.last_name?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-sm text-gray-500">
                      {removeProfileImage
                        ? "Profile picture will be removed."
                        : userData.profile_url && !profilePreview
                        ? "Current profile picture. Click below to change."
                        : profilePreview
                        ? "New profile picture selected."
                        : "No profile picture selected."}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {(userData.profile_url || profilePreview) &&
                        !removeProfileImage
                          ? "Change"
                          : "Upload"}
                      </Button>

                      {(profilePreview || userData.profile_url) &&
                        !removeProfileImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveProfileImage}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                    </div>
                  </div>
                </div>

                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>

              {/* Background Image */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Background Image
                  </Label>
                  <p className="text-xs text-gray-500">
                    {removeBackgroundImage
                      ? "Background image will be removed."
                      : "Drag and drop an image here, or tap to select"}
                  </p>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer relative min-h-[140px] sm:min-h-[160px] hover:border-gray-400 transition-colors"
                  onDrop={handleBackgroundDrop}
                  onDragOver={handleDragOver}
                  onClick={() => backgroundInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      backgroundInputRef.current?.click();
                    }
                  }}
                >
                  {!removeBackgroundImage &&
                  (backgroundPreview || userData.background_url) ? (
                    <div className="relative h-32 sm:h-40 w-full">
                      <Image
                        src={backgroundPreview || userData.background_url}
                        alt="Background"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8 shadow-sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleRemoveBackgroundImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 px-2 text-center">
                        {removeBackgroundImage
                          ? "Background image will be removed"
                          : "Tap to upload background image"}
                      </p>
                    </div>
                  )}

                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Action Buttons - Fixed positioning and spacing */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !hasChanged}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/actions/profile/updateUserProfile.action";
import { Camera, Upload, X } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  userData: {
    first_name: string;
    last_name: string;
    bio: string;
    profile_url: string;
    background_url: string;
    class?: string;
    branch?: string;
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userRole,
  userData,
}: EditProfileModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form state
  const [bio, setBio] = useState(userData.bio || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );
  const [classValue, setClassValue] = useState(userData.class || "");
  const [branch, setBranch] = useState(userData.branch || "");

  // Refs for file inputs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append("bio", bio);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (backgroundImage) {
        formData.append("backgroundImage", backgroundImage);
      }

      // Add student-specific fields if applicable
      if (userRole === "student") {
        formData.append("class", classValue);
        formData.append("branch", branch);
      }

      // Call the server action to update profile
      await updateUserProfile(formData);

      // Close modal and refresh page
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag and drop for background image
  const handleBackgroundDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setBackgroundImage(file);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              {userRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input
                      id="class"
                      value={classValue}
                      onChange={(e) => setClassValue(e.target.value)}
                      placeholder="Your class"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="Your branch"
                    />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-4 py-4">
              {/* Profile Image */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-gray-200">
                    <AvatarImage
                      src={profilePreview || userData.profile_url}
                      alt="Profile"
                    />
                    <AvatarFallback>
                      {userData.first_name?.[0]}
                      {userData.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => profileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change
                    </Button>

                    {profilePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProfileImage(null);
                          setProfilePreview(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}

                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Background Image */}
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer relative"
                  onDrop={handleBackgroundDrop}
                  onDragOver={handleDragOver}
                  onClick={() => backgroundInputRef.current?.click()}
                >
                  {backgroundPreview || userData.background_url ? (
                    <div className="relative h-40 w-full">
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
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setBackgroundImage(null);
                          setBackgroundPreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Drag and drop an image here, or click to select
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

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

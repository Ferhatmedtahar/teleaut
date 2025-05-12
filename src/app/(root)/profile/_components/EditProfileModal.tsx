"use client";

import type React from "react";

import { updateUserProfile } from "@/actions/profile/updateUserProfile.action";
import { Button } from "@/components/common/buttons/Button";
import BranchSelector from "@/components/common/select/BranchSelector";
import ClassSelector from "@/components/common/select/ClassSelector";
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
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import type { roles } from "@/types/roles.enum";
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
  readonly userRole: roles.admin | roles.student | roles.teacher;
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

  // Handle class change for students
  const handleClassChange = (value: keyof typeof studentClassesAndBranches) => {
    setSelectedClass(value);
    setAvailableBranches(studentClassesAndBranches[value] ?? []);
    setValue("class", value);
    setValue("branch", "");
  };

  // Handle branch change for students
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    setValue("branch", value);
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

  // Form submission
  async function onSubmit(data: EditProfileSchema) {
    try {
      const formData = new FormData();
      //userData to compare if user has updated their profile or no if no we dont show toast message and save.
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

      // Add student-specific fields if applicable
      if (userRole === "student") {
        if (!selectedClass) {
          toast.error("Please select a class");
          return;
        }

        if (
          !selectedBranch &&
          availableBranches.length > 1 &&
          availableBranches[0] !== "Aucune filière"
        ) {
          toast.error("Please select a branch");
          return;
        }
        formData.append("prev_class", userData.class ?? "");
        formData.append("prev_branch", userData.branch ?? "");

        formData.append("class", data.class ?? "");
        formData.append("branch", data.branch ?? "");
      }

      // Call the server action to update profile
      const { success, message } = await updateUserProfile(formData);
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
      toast.error("Failed to update profile");
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
      (userRole === "student" &&
        (watchedClass !== userData.class || watchedBranch !== userData.branch));

    setHasChanged(isChanged);
  }, [
    watchedBio,
    watchedClass,
    watchedBranch,
    profileImage,
    backgroundImage,
    userData,
    userRole,
  ]);
  console.log(hasChanged);
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-red-500">{errors.bio.message}</p>
                )}
              </div>

              {userRole === "student" && (
                <>
                  <div className="flex flex-col gap-1">
                    <Label>Classe</Label>
                    <ClassSelector
                      handleClassChange={handleClassChange}
                      currentClass={selectedClass}
                    />
                    <Input
                      type="hidden"
                      {...register("class")}
                      value={selectedClass}
                    />
                    {errors.class && (
                      <p className="text-red-500">{errors.class.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label>Filière</Label>
                    <BranchSelector
                      currentBranch={selectedBranch}
                      selectedClass={
                        selectedClass as keyof typeof studentClassesAndBranches
                      }
                      availableBranches={availableBranches}
                      handleBranchChange={handleBranchChange}
                    />
                    <Input
                      type="hidden"
                      {...register("branch")}
                      value={selectedBranch}
                    />
                    {errors.branch && (
                      <p className="text-red-500">{errors.branch.message}</p>
                    )}
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

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                      {userData.profile_url && !profilePreview
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
                        {userData.profile_url || profilePreview
                          ? "Change"
                          : "Upload"}
                      </Button>

                      {(profilePreview || userData.profile_url) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProfileImage(null);
                            setProfilePreview(null);
                            if (profileInputRef.current) {
                              profileInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
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
              </div>

              {/* Background Image */}
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <Label>Background Image</Label>
                  <span className="text-xs text-gray-500">
                    Current background picture, Drag and drop an image here, or
                    click to select
                  </span>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer relative"
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
                          if (backgroundInputRef.current) {
                            backgroundInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
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
              <Button type="submit" disabled={isSubmitting || !hasChanged}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// // "use client";

// // import type React from "react";

// // import { updateUserProfile } from "@/actions/profile/updateUserProfile.action";
// // import { Button } from "@/components/common/buttons/Button";
// // import BranchSelector from "@/components/common/select/BranchSelector";
// // import ClassSelector from "@/components/common/select/ClassSelector";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Textarea } from "@/components/ui/textarea";
// // import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
// // import { roles } from "@/types/roles.enum";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Camera, Upload, X } from "lucide-react";
// // import Image from "next/image";
// // import { useRouter } from "next/navigation";
// // import { useRef, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { toast } from "sonner";
// // import { z } from "zod";
// // const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
// // interface EditProfileModalProps {
// //   readonly isOpen: boolean;
// //   readonly onClose: () => void;
// //   readonly userRole: roles.admin | roles.student | roles.teacher;
// //   readonly userData: {
// //     first_name: string;
// //     last_name: string;
// //     bio: string;
// //     profile_url: string;
// //     background_url: string;
// //     class?: string;
// //     branch?: string;
// //   };
// // }

// // const editProfileSchema = z.object({
// //   bio: z.string().optional(),
// //   profileImage: z.any().optional(),
// //   backgroundImage: z.any().optional(),
// //   branch: z.string().optional(),
// //   class: z.string({
// //     message: "Please select a class",
// //   }),
// //   background: z
// //     .any()
// //     .refine((file) => {
// //       return (
// //         file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
// //         "background must be a WEBP, JPG, or PNG file"
// //       );
// //     })
// //     .optional(),
// //   profile: z
// //     .any()
// //     .refine((file) => {
// //       return (
// //         file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
// //         "profile must be a WEBP, JPG, or PNG file"
// //       );
// //     })
// //     .optional(),
// // });

// // type EditProfileSchema = z.infer<typeof editProfileSchema>;
// // const allClasses = Object.keys(studentClassesAndBranches);
// // export default function EditProfileModal({
// //   isOpen,
// //   onClose,
// //   userRole,
// //   userData,
// // }: EditProfileModalProps) {
// //   const router = useRouter();

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors, isSubmitting },
// //     setValue,
// //   } = useForm<EditProfileSchema>({
// //     resolver: zodResolver(editProfileSchema),
// //     defaultValues: {
// //       bio: userData.bio ?? "",
// //       class: userData.class ?? "",
// //       branch: userData.branch ?? "",
// //     },
// //   });
// //   const [activeTab, setActiveTab] = useState("general");
// //   // Refs for file inputs
// //   const [profileImage, setProfileImage] = useState<File | null>(null);
// //   const [profilePreview, setProfilePreview] = useState<string | null>(null);
// //   const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
// //   const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
// //     null
// //   );

// //   const [selectedClass, setSelectedClass] = useState<string>(
// //     userData?.class ?? ""
// //   );
// //   const [availableBranches, setAvailableBranches] = useState<string[]>([]);
// //   const [selectedBranch, setSelectedBranch] = useState<string>(
// //     userData?.branch ?? ""
// //   );

// //   const handleClassChange = (value: keyof typeof studentClassesAndBranches) => {
// //     setSelectedClass(value);
// //     setAvailableBranches(studentClassesAndBranches[value] ?? []);
// //     setValue("class", value);
// //     setValue("branch", "");
// //   };

// //   const handleBranchChange = (value: string) => {
// //     setValue("branch", value);
// //   };

// //   const profileInputRef = useRef<HTMLInputElement>(null);
// //   const backgroundInputRef = useRef<HTMLInputElement>(null);

// //   // Handle profile image change
// //   const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setProfileImage(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setProfilePreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // Handle background image change
// //   const handleBackgroundImageChange = (
// //     e: React.ChangeEvent<HTMLInputElement>
// //   ) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       setBackgroundImage(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setBackgroundPreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // Handle form submission
// //   async function onSubmit(data: EditProfileSchema) {
// //     try {
// //       const formData = new FormData();
// //       formData.append("bio", data.bio ?? "");
// //       formData.append("profileImage", data.profileImage ?? "");
// //       formData.append("backgroundImage", data.backgroundImage ?? "");

// //       // Add student-specific fields if applicable
// //       if (userRole === "student") {
// //         if (!selectedClass) {
// //           toast.error("Please select a class");
// //           return;
// //         }

// //         if (
// //           !data.branch &&
// //           availableBranches.length != 1 &&
// //           availableBranches[0] != "Aucune filière"
// //         ) {
// //           toast.error("Please select a branch");
// //           return;
// //         }

// //         formData.append("class", data.class ?? "");
// //         formData.append("branch", data.branch ?? "");
// //       }
// //       console.log(Object.fromEntries(formData));
// //       console.log(userRole);

// //       // Call the server action to update profile
// //       const { success, message } = await updateUserProfile(formData);
// //       if (success) {
// //         toast.success(message);
// //       }
// //       if (!success) {
// //         toast.error(message);
// //       }
// //       // Close modal and refresh page
// //       onClose();
// //       router.refresh();
// //     } catch (error) {
// //       console.error("Error updating profile:", error);
// //     }
// //   }

// //   // Handle drag and drop for background image
// //   const handleBackgroundDrop = (e: React.DragEvent) => {
// //     e.preventDefault();
// //     const file = e.dataTransfer.files?.[0];
// //     if (file) {
// //       setBackgroundImage(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setBackgroundPreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleDragOver = (e: React.DragEvent) => {
// //     e.preventDefault();
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-[500px]">
// //         <DialogHeader>
// //           <DialogTitle>Edit Profile</DialogTitle>
// //         </DialogHeader>

// //         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
// //           <TabsList className="grid w-full grid-cols-2">
// //             <TabsTrigger value="general">General</TabsTrigger>
// //             <TabsTrigger value="images">Images</TabsTrigger>
// //           </TabsList>

// //           <form onSubmit={handleSubmit(onSubmit)}>
// //             <TabsContent value="general" className="space-y-4 py-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="bio">Bio</Label>
// //                 <Textarea
// //                   id="bio"
// //                   {...register("bio")}
// //                   placeholder="Tell us about yourself"
// //                   rows={4}
// //                 />
// //                 {"bio" in errors && errors.bio && (
// //                   <p className="text-red-500">
// //                     {errors.bio?.message?.toString()}
// //                   </p>
// //                 )}
// //               </div>

// //               {userRole === "student" && (
// //                 <>
// //                   <div className="flex flex-col gap-1">
// //                     <Label>Classe</Label>
// //                     <ClassSelector
// //                       handleClassChange={handleClassChange}
// //                       currentClass={selectedClass}
// //                     />
// //                     <Input type="hidden" {...register("class")} />
// //                     {"class" in errors && errors.class && (
// //                       <p className="text-red-500">{errors.class.message}</p>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col gap-1">
// //                     <Label>Filière</Label>
// //                     <BranchSelector
// //                       currentBranch={selectedBranch}
// //                       selectedClass={
// //                         selectedClass as keyof typeof studentClassesAndBranches
// //                       }
// //                       availableBranches={availableBranches}
// //                       handleBranchChange={handleBranchChange}
// //                     />
// //                     <Input type="hidden" {...register("branch")} />
// //                     {"branch" in errors && errors.branch && (
// //                       <p className="text-red-500">{errors.branch.message}</p>
// //                     )}
// //                   </div>
// //                 </>
// //               )}
// //             </TabsContent>

// //             <TabsContent value="images" className="space-y-4 py-4">
// //               {/* Profile Image */}
// //               <div className="space-y-2">
// //                 <Label>Profile Picture</Label>
// //                 <div className="flex items-center gap-4">
// //                   <Avatar className="h-20 w-20 border-2 border-gray-200">
// //                     <AvatarImage
// //                       src={profilePreview ?? userData.profile_url}
// //                       alt="Profile"
// //                     />
// //                     <AvatarFallback>
// //                       {userData.first_name?.[0]}
// //                       {userData.last_name?.[0]}
// //                     </AvatarFallback>
// //                   </Avatar>

// //                   <div className="flex gap-2">
// //                     <Button
// //                       type="button"
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => profileInputRef.current?.click()}
// //                     >
// //                       <Camera className="h-4 w-4 mr-2" />
// //                       Change
// //                     </Button>

// //                     {profilePreview && (
// //                       <Button
// //                         type="button"
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => {
// //                           setProfileImage(null);
// //                           setProfilePreview(null);
// //                         }}
// //                       >
// //                         <X className="h-4 w-4 mr-2" />
// //                         Remove
// //                       </Button>
// //                     )}

// //                     <input
// //                       ref={profileInputRef}
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={handleProfileImageChange}
// //                       className="hidden"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Background Image */}
// //               <div className="space-y-2">
// //                 <Label>Background Image</Label>
// //                 <div
// //                   className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer relative"
// //                   onDrop={handleBackgroundDrop}
// //                   onDragOver={handleDragOver}
// //                   onClick={() => backgroundInputRef.current?.click()}
// //                 >
// //                   {backgroundPreview || userData.background_url ? (
// //                     <div className="relative h-40 w-full">
// //                       <Image
// //                         src={backgroundPreview || userData.background_url}
// //                         alt="Background"
// //                         fill
// //                         className="object-cover rounded-md"
// //                       />
// //                       <Button
// //                         type="button"
// //                         variant="outline"
// //                         size="icon"
// //                         className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
// //                         onClick={(e: React.MouseEvent) => {
// //                           e.stopPropagation();
// //                           setBackgroundImage(null);
// //                           setBackgroundPreview(null);
// //                         }}
// //                       >
// //                         <X className="h-4 w-4" />
// //                       </Button>
// //                     </div>
// //                   ) : (
// //                     <div className="py-8 flex flex-col items-center">
// //                       <Upload className="h-10 w-10 text-gray-400 mb-2" />
// //                       <p className="text-sm text-gray-500">
// //                         Drag and drop an image here, or click to select
// //                       </p>
// //                     </div>
// //                   )}

// //                   <input
// //                     ref={backgroundInputRef}
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleBackgroundImageChange}
// //                     className="hidden"
// //                   />
// //                 </div>
// //               </div>
// //             </TabsContent>

// //             <div className="flex justify-end gap-2 mt-4">
// //               <Button type="button" variant="outline" onClick={onClose}>
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isSubmitting}>
// //                 {isSubmitting ? "Saving..." : "Save Changes"}
// //               </Button>
// //             </div>
// //           </form>
// //         </Tabs>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

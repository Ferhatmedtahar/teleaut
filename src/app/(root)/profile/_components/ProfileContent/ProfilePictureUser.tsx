"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePictureUser({
  imageUrl,

  firstName,
  lastName,
}: {
  readonly imageUrl: string;

  readonly firstName: string;
  readonly lastName: string;
}) {
  return (
    <div className="absolute left-8 -bottom-12">
      <Avatar className="h-24 w-24 border-4 border-white">
        <AvatarImage src={`${imageUrl}`} alt={`${firstName} ${lastName}`} />
        <AvatarFallback className="text-2xl">
          {firstName[0]}
          {lastName[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

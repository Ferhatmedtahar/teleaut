"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../common/buttons/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, MoreHorizontal, Star } from "lucide-react";

type ProfessorProps = {
  name: string;
  rating: number;
  image: string;
  specialty: string;
};

const ProfessorCard = ({ name, rating, image, specialty }: ProfessorProps) => {
  return (
    <Card className="flex flex-row items-start p-4 w-full max-w-2xl ">
      {/* Image Section */}
      <Avatar className="w-30 h-30 rounded-xl ">
        <AvatarImage
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Professor"
        />
        <AvatarFallback>DA</AvatarFallback>
      </Avatar>

      {/* Info Section */}
      <div className=" flex-1 ">
        <CardHeader className="flex flex-row justify-between items-start p-0">
          <div>
            <CardTitle className="text-md">{name}</CardTitle>
            <div className="flex items-center space-x-1 text-yellow-500 text-sm">
              <span>{rating}</span>
              <Star className="w-4 h-4 fill-yellow-500" />
            </div>
          </div>
          <MoreHorizontal className="text-gray-500 mt-1" />
        </CardHeader>

        <CardDescription className="text-gray-700 mt-2">
          {specialty}
        </CardDescription>

        {/* Buttons */}
        <CardContent className="mt-4 space-y-2 p-0">
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button className="w-full bg-[#365A6A] hover:bg-[#2c4c5b]">
            <Send className="mr-2 h-4 w-4" />
            Demander
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfessorCard;

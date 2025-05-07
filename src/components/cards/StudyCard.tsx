import React from "react";
import { FaCirclePlay } from "react-icons/fa6"; // Play icon
import { FaChevronDown } from "react-icons/fa"; // Dropdown arrow

interface StudyCardProps {
  title: string;
  date: string;
  message: string;
  tags: string[];
}

const StudyCard: React.FC<StudyCardProps> = ({
  title,
  date,
  message,
  tags,
}) => {
  return (
    <div className="flex bg-gray-100 rounded-xl shadow-md overflow-hidden max-w-3xl w-full p-4">
      {/* Left thumbnail */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src="https://flagcdn.com/w320/fr.png" // Use your actual image here
          alt="French Flag"
          className="w-full h-full object-cover"
        />
        <FaCirclePlay className="absolute inset-0 m-auto text-white text-2xl bg-black bg-opacity-50 rounded-full p-1" />
      </div>

      {/* Right content */}
      <div className="ml-4 flex flex-col justify-between flex-grow">
        {/* Top buttons */}
        <div className="flex gap-2 mb-2">
          {tags.map((item, i) => (
            <div key={i} className="relative">
              <span className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {item}
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {/* Next session */}
        <p className="text-gray-700 text-sm mt-1">
          Prochain séance : <span className="font-medium">{date}</span>
        </p>

        {/* Message preview */}
        <p className="text-gray-800 text-sm mt-1 truncate">{message}</p>
      </div>

      {/* Dropdown icon */}
      <div className="ml-auto self-start">
        <FaChevronDown className="text-gray-600" />
      </div>
    </div>
  );
};

export default StudyCard;

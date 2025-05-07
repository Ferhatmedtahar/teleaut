// app/etude/components/EtudesButton.tsx
import { FaBook } from "react-icons/fa";

type Props = {
  isActive: boolean;
  onClick: () => void;
};

export default function EtudesButton({ isActive, onClick }: Props) {
  return (
    <button
      className={`flex items-center px-4 py-2 font-medium ${
        isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
      }`}
      onClick={onClick}
    >
      <FaBook className="mr-2" />
      Mes études
    </button>
  );
}

"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function FileCard({ url }: { readonly url: string }) {
  const fileNameWithExtension = url.split("/").pop() ?? "";
  const fileName = fileNameWithExtension.split(".")[0].slice(0, 6);
  const fileType = fileNameWithExtension.split(".").pop();
  const { theme } = useTheme();
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-background/90 dark:bg-gray-800 rounded-xl p-4 shadow-sm w-full max-w-md hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full w-fit mb-1">
            {fileType?.toUpperCase() ?? "FILE"}
          </span>
          <p className="font-medium text-gray-800 dark:text-white">
            {fileName}
          </p>
        </div>
        {theme === "dark" ? (
          <Image
            src={`/icons/document-dark.svg`}
            height={26}
            width={26}
            alt="File icon"
          />
        ) : (
          <Image
            src={`/icons/document.svg`}
            height={26}
            width={26}
            alt="File icon"
          />
        )}
      </div>
    </Link>
  );
}

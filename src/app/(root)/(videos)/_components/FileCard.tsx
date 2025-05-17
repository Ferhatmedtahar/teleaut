import Image from "next/image";
import Link from "next/link";

export default function FileCard({ url }: { readonly url: string }) {
  // Get the full file name from the URL
  const fileNameWithExtension = url.split("/").pop() ?? "";
  const fileName = fileNameWithExtension.split(".")[0].slice(0, 6);
  const fileType = fileNameWithExtension.split(".").pop();

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl p-4 shadow-md w-full max-w-md hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full w-fit mb-1">
            {fileType?.toUpperCase() ?? "FILE"}
          </span>
          <p className="font-medium text-gray-800">{fileName}</p>
        </div>
        <Image
          src={`/icons/document.svg`}
          height={26}
          width={26}
          alt="File icon"
        />
      </div>
    </Link>
  );
}

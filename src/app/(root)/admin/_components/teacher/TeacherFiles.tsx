// import { Button } from "@/components/common/buttons/Button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { FileIcon } from "lucide-react";
// import { getTeacherFiles } from "../../_lib/admin";
// import { TeacherFile } from "@/types/TeacherFile";

// export function TeacherFiles({
//   files,
// }: {
//   readonly files: Awaited<ReturnType<typeof getTeacherFiles>>;
// }) {
//   if (files.length === 0) {
//     return (
//       <Card>
//         <CardContent className="pt-6 text-center">
//           <p>No files uploaded by this teacher.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {files.map((file: TeacherFile) => (
//         <Card key={file.id}>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base">
//               {file.title ?? file.file_type}
//             </CardTitle>
//             {file.description && (
//               <CardDescription>{file.description}</CardDescription>
//             )}
//           </CardHeader>
//           <CardContent className="pb-2">
//             <div className="flex items-center gap-2">
//               <FileIcon className="h-5 w-5" />
//               <span className="text-sm">{file.file_path.split("/").pop()}</span>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" className="w-full" asChild>
//               <a href={file.file_url} target="_blank" rel="noopener noreferrer">
//                 View Document
//               </a>
//             </Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }
"use client";

import { Button } from "@/components/common/buttons/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeacherFile } from "@/types/TeacherFile";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TeacherFiles({
  files,
}: {
  readonly files: Awaited<TeacherFile[]>;
}) {
  const [openFileId, setOpenFileId] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No files uploaded by this teacher.</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  console.log(files);
  return (
    <>
      {files.map((file: TeacherFile) => {
        const fileName = file.file_path.split("/").pop();
        const isOpen = openFileId === file.id;

        return (
          <Card key={file.id} className="mb-4">
            <CardHeader>
              <CardTitle>{file.title ?? file.file_type}</CardTitle>
              {file.description && (
                <CardDescription>{file.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{fileName}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setOpenFileId(isOpen ? null : file.id)}
              >
                {isOpen ? "Hide Document" : "View Document"}
              </Button>
              {isOpen && (
                <Link
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-center gap-2 "
                  >
                    <span>View Document </span>
                    <ExternalLink className="w-4 h-4 " />
                  </Button>
                </Link>
              )}
            </CardFooter>

            {isOpen && (
              <CardContent>
                <iframe
                  src={file.file_url}
                  className="w-full h-[600px] border rounded"
                />
              </CardContent>
            )}
          </Card>
        );
      })}
    </>
  );
}

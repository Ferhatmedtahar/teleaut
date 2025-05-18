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
  // console.log(files);
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
                  title={`${file.file_type}${file.id}`}
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

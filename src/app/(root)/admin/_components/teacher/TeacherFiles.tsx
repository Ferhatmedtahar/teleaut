import { Button } from "@/components/common/buttons/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import { getTeacherFiles } from "../../_lib/admin";
import { TeacherFile } from "@/types/TeacherFile";

export function TeacherFiles({
  files,
}: {
  readonly files: Awaited<ReturnType<typeof getTeacherFiles>>;
}) {
  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>No files uploaded by this teacher.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {files.map((file: TeacherFile) => (
        <Card key={file.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {file.title ?? file.file_type}
            </CardTitle>
            {file.description && (
              <CardDescription>{file.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              <span className="text-sm">{file.file_path.split("/").pop()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

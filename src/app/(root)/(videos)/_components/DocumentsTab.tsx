"use client";

import { useState } from "react";
import { File, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface DocumentsTabProps {
  documentsUrl: string | null;
  notesUrl: string | null;
}

export default function DocumentsTab({
  documentsUrl,
  notesUrl,
}: DocumentsTabProps) {
  const [activeTab, setActiveTab] = useState("documents");

  if (!documentsUrl && !notesUrl) {
    return null;
  }

  return (
    <Tabs
      defaultValue="documents"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="documents" disabled={!documentsUrl}>
          Documents
        </TabsTrigger>
        <TabsTrigger value="notes" disabled={!notesUrl}>
          Notes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="p-4 border rounded-b-lg">
        {documentsUrl ? (
          <div className="flex flex-col items-center">
            <File size={48} className="text-blue-500 mb-2" />
            <p className="text-sm text-center mb-4">
              Course materials and resources
            </p>
            <Button asChild>
              <a href={documentsUrl} target="_blank" rel="noopener noreferrer">
                Download Documents
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No documents available
          </p>
        )}
      </TabsContent>

      <TabsContent value="notes" className="p-4 border rounded-b-lg">
        {notesUrl ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-green-500 mb-2" />
            <p className="text-sm text-center mb-4">
              Lecture notes and summaries
            </p>
            <Button asChild>
              <a href={notesUrl} target="_blank" rel="noopener noreferrer">
                Download Notes
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No notes available</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

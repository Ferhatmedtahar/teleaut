"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import CommentSection from "./CommentSection";
import FileCard from "./FileCard";

interface DocumentsTabProps {
  readonly documentsUrl: string | null;
  readonly notesUrl: string | null;
  readonly currentVideoId: string;
}

export default function DocumentsCommentsTab({
  documentsUrl,
  notesUrl,
  currentVideoId,
}: DocumentsTabProps) {
  const [activeTab, setActiveTab] = useState("documents");

  if (!documentsUrl && !notesUrl) {
    return null;
  }

  return (
    <Tabs
      defaultValue="documents"
      className="w-full   border border-border/20  dark:border-border/90 rounded-xl p-2"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 rounded-xl dark:bg-primary-900/40 ">
        <TabsTrigger
          className=" rounded-xl"
          value="documents"
          disabled={!documentsUrl && !notesUrl}
        >
          <span className="dark:text-white/90">Documents</span>
        </TabsTrigger>
        <TabsTrigger
          className=" rounded-xl"
          value="comments"
          disabled={!currentVideoId}
        >
          <span className="dark:text-white/90">Commentaires</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="p-1">
        <div className="space-y-4">
          {documentsUrl && <FileCard url={documentsUrl} key={documentsUrl} />}

          {notesUrl && <FileCard url={notesUrl} key={notesUrl} />}
        </div>
      </TabsContent>

      <TabsContent value="comments" className="p-1">
        <CommentSection videoId={currentVideoId} />
      </TabsContent>
    </Tabs>
  );
}

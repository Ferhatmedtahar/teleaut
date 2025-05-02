"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "../_components/ui/avatar";
import { Button } from "../_components/ui/button";
import { Checkbox } from "../_components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog";
import { ScrollArea } from "../_components/ui/scroll-area";
import { useChat } from "../_context/chat-context";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const router = useRouter();
  const { users, createGroupChat } = useChat();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setSelectedUsers([]);
      setError("");
    }
  }, [isOpen]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    setError("");

    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }

    if (selectedUsers.length < 2) {
      setError("Please select at least 2 participants (3 including you)");
      return;
    }

    try {
      const chatId = createGroupChat(groupName, selectedUsers);
      onClose();
      router.push(`/chats/${chatId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create group");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-start space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Participants (minimum 2)</Label>
            <div className="text-xs text-gray-500 mb-2">
              You need at least 2 other participants to create a group
            </div>
            <ScrollArea className="h-60 border rounded-md p-2">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        {user.avatar}
                      </div>
                    </Avatar>
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {user.username}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="text-sm">
              Selected:{" "}
              <span className="font-medium">{selectedUsers.length}</span> of{" "}
              {users.length} users
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

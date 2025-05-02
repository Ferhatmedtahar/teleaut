import { EmptyState } from "./_components/empty-state";

export default function ChatsPage() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <EmptyState
        title="Select a chat"
        description="Choose a conversation from the sidebar or start a new chat."
      />
    </div>
  );
}

import { Button } from "@/components/common/buttons/Button";
import { Share } from "lucide-react";
import { toast } from "sonner";

export default function ShareLink({
  isLoading,
}: {
  readonly isLoading: boolean;
}) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 dark:text-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 border-border/40 hover:border-border/80 transition-colors duration-200"
      onClick={handleShare}
    >
      <Share size={19} />
      <span>Share</span>
    </Button>
  );
}

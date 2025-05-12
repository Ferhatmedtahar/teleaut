import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
export default function BranchSelector({
  selectedClass,
  availableBranches,
  handleBranchChange,
  currentBranch,
}: {
  readonly selectedClass: keyof typeof studentClassesAndBranches;
  readonly availableBranches: string[];
  readonly handleBranchChange: (value: string) => void;
  readonly currentBranch?: string;
}) {
  const placeholder = currentBranch || "Sélectionnez une filière";
  return (
    <Select
      onValueChange={handleBranchChange}
      disabled={!selectedClass || availableBranches.length <= 1}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {availableBranches.map((branch) => (
          <SelectItem key={branch} value={branch}>
            {branch}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

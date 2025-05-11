import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
const allClasses = Object.keys(studentClassesAndBranches);
export default function ClassSelector({
  handleClassChange,
  currentClass,
}: {
  readonly handleClassChange: (
    value: keyof typeof studentClassesAndBranches
  ) => void;
  readonly currentClass?: string;
}) {
  return (
    <Select onValueChange={handleClassChange}>
      <SelectTrigger className="w-full">
        <SelectValue
          // placeholder="Sélectionnez votre classe"
          placeholder={currentClass || "Sélectionnez votre classe"}
        />
      </SelectTrigger>
      <SelectContent>
        {allClasses.map((classOption) => (
          <SelectItem key={classOption} value={classOption}>
            {classOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

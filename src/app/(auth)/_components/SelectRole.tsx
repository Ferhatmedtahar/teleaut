import { Roles } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectRole({
  value,
  onChange,
}: {
  readonly value: Roles | "";
  readonly onChange: (value: Roles) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full py-5">
        <SelectValue placeholder="Etudiant ou Professeur" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="teacher">Professeur</SelectItem>
          <SelectItem value="student">Etudiant</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

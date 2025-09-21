import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PreferredTime = "morning" | "afternoon" | "evening" | "night";

export function SelectPreferredTime({
  value,
  onChange,
}: {
  readonly value: PreferredTime | "" | undefined;
  readonly onChange: (value: PreferredTime) => void;
}) {
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="w-full py-5">
        <SelectValue placeholder="Preferred Time" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="morning">Morning</SelectItem>
          <SelectItem value="afternoon">Afternoon</SelectItem>
          <SelectItem value="evening">Evening</SelectItem>
          <SelectItem value="night">Night</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

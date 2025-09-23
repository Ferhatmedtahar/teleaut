"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  error = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Format date as YYYY-MM-DD for form compatibility
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange?.(formattedDate);
      setOpen(false);
    }
  };

  const displayDate = selectedDate
    ? format(selectedDate, "PPP", { locale: fr })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !selectedDate && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {displayDate}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < tomorrow}
          initialFocus
          locale={fr}
          // captionLayout="dropdown-buttons"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 2}
        />
      </PopoverContent>
    </Popover>
  );
}
// "use client";

// import { ChevronDownIcon } from "lucide-react";
// import * as React from "react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export function DatePicker() {
//   const [open, setOpen] = React.useState(false);
//   const [date, setDate] = React.useState<Date | undefined>(undefined);

//   return (
//     <div className="flex flex-col gap-3">
//       <Label htmlFor="date" className="px-1">
//         Date of birth
//       </Label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             id="date"
//             className="w-48 justify-between font-normal"
//           >
//             {date ? date.toLocaleDateString() : "Select date"}
//             <ChevronDownIcon />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             captionLayout="dropdown"
//             onSelect={(date) => {
//               setDate(date);
//               setOpen(false);
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);

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
      <PopoverContent
        className="w-auto p-0 bg-background dark:text-white "
        align="start"
      >
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


import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@client/lib/cn"
import { Button } from "@client/components/ui/button"
import { Calendar } from "@client/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@client/components/ui/popover"

interface DatePickerProps {
  setDate : React.Dispatch<React.SetStateAction<Date>>;
  date : Date
}

export function DatePicker({date, setDate} : DatePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if(d)setDate(d)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}


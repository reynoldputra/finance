import { Column, Table, Row, FilterFn } from "@tanstack/react-table";
import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@client/lib/cn"
import { Button } from "@client/components/ui/button"
import { Calendar } from "@client/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@client/components/ui/popover"

export function dateBetweenFilterFn<T>(row: Row<T>, id: string, filterValues: unknown) {
  let sd = (filterValues as number[])?.[0];
  let ed = (filterValues as number[])?.[1];
  const val = row.getValue(id)
  if (!val) return false
  if (sd) {
    var time = (val as Date).getTime()
    if (ed) {
      return (time >= sd && time <= ed);
    } else {
      return (time == sd);
    }
  } else {
    return true
  }
}

interface DatePickerFilterProps<T> {
  column: Column<T>
  className?: string
}

export function DatePickerWithRangeFilter<T>({ className = "", column }: DatePickerFilterProps<T>) {

  const [date, setDate] = React.useState<DateRange | undefined>()

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(value) => {
              setDate(value)
              if (value?.from) {
                column.setFilterValue((old: [number, number]) => [value.from?.getTime(), old?.[1]])
              }
              if (value?.to) {
                column.setFilterValue((old: [number, number]) => [old?.[0], value.to?.getTime()])
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

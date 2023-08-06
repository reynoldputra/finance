import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormDescription,
  FormMessage,
} from "@client/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@client/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@client/lib/cn";
import { Calendar } from "@client/components/ui/calendar";
import { Button } from "@client/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface DateInputProps {
  name: string;
  title: string;
  description?: string;
  errorMessage?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  title,
  description,
  errorMessage,
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-base">{title}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(field.value)}
                onSelect={field.onChange}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription className="text-base">{description}</FormDescription>}
          {errorMessage && <FormMessage className="text-base">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default DateInput;

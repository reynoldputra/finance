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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@client/components/ui/command";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@client/lib/cn";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Calendar } from "@client/components/ui/calendar";
import { format } from "date-fns";

interface Option {
  title: string;
  value: string;
}

// change the schema
interface CustomFormFieldProps {
  title: string;
  description?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  options?: readonly Option[];
}

const InputForm: React.FC<CustomFormFieldProps> = ({
  title,
  description,
  errorMessage,
  type,
  options,
}) => {
  const form = useFormContext();
  if (type === "number" || type === "text") {
    return (
      <FormField
        control={form.control}
        name={title}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <FormControl>
              <Input
                type={type}
                value={String(field.value) ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
          </FormItem>
        )}
      />
    );
  } else if (type === "combobox") {
    return (
      <FormField
        control={form.control}
        name={title}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? options?.find(
                          (language) => language.value === field.value
                        )?.title
                      : "Select language"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {options?.map((language) => (
                      <CommandItem
                        value={language.value}
                        key={language.value}
                        onSelect={(value) => {
                          form.setValue("Language", value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            language.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {language.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
          </FormItem>
        )}
      />
    );
  } else if (type === "datepicker") {
    return (
      <FormField
        control={form.control}
        name={title}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
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
            <FormDescription>
              Your date of birth is used to calculate your age.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else {
    return null;
  }
};

export default InputForm;

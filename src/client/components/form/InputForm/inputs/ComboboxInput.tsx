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
import { Button } from "@client/components/ui/button";
import { useFormContext } from "react-hook-form";
import { cn } from "@client/lib/cn";
import { Check, ChevronsUpDown } from "lucide-react";

interface Option {
  title: string;
  value: string;
}

interface ComboboxInputProps {
  name: string;
  title: string;
  description?: string;
  errorMessage?: string;
  options?: readonly Option[];
}

const ComboboxInput: React.FC<ComboboxInputProps> = ({
  name,
  title,
  description,
  errorMessage,
  options,
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
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
};

export default ComboboxInput;

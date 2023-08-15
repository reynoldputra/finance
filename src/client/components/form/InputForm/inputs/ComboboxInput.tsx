import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormDescription,
  FormMessage,
} from "@client/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@client/components/ui/popover";
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
import { ComboboxItem } from "@client/types/form/ComboboxItem";

interface ComboboxInputProps {
  name: string;
  title: string;
  description?: string;
  errorMessage?: string;
  options?: readonly ComboboxItem[];
  disabled ?: boolean
}

const ComboboxInput: React.FC<ComboboxInputProps> = ({
  name,
  disabled = false,
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
          <FormLabel className="text-base">{title}</FormLabel>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? options?.find((language) => language.value === field.value)?.title || field.value
                      : `Select ...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
                  <CommandEmpty>{`No ${title.toLowerCase()} found.`}</CommandEmpty>
                  <CommandGroup>
                    {options?.map((language) => (
                      <CommandItem
                        disabled={language.disabled}
                        value={language.value.toString()}
                        key={language.value}
                        onSelect={() => {
                          form.setValue(name, (form.getValues(name) == language.value ? "" : language.value));
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            language.value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {language.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription className="text-base">{description}</FormDescription>}
            {errorMessage && <FormMessage className="text-base">{errorMessage}</FormMessage>}
          </div>
        </FormItem>
      )}
    />
  );
};

export default ComboboxInput;

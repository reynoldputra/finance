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
  title?: string;
  description?: string;
  errorMessage?: string;
  options?: readonly ComboboxItem[];
  disabled?: boolean;
  width?: number;
  value?: string
  onChange?: (str: string) => void;
}

const ComboboxInput: React.FC<ComboboxInputProps> = ({
  name,
  disabled = false,
  title,
  description,
  value,
  errorMessage,
  onChange,
  options,
  width = 200,
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && <FormLabel className="text-base">{title}</FormLabel>}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn("justify-between", !field.value && "text-muted-foreground")}
                    style={{
                      width: width + "px",
                    }}
                  >
                    {field.value
                      ? options?.find((language) => language.value === field.value)?.title || field.value
                      : `Select ...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                style={{
                  width: width + "px",
                }}
              >
                <Command>
                  <CommandInput placeholder={`Search...`} />
                  <CommandEmpty>{`Item not found.`}</CommandEmpty>
                  <CommandGroup>
                    {options?.map((language) => (
                      <CommandItem
                        disabled={language.disabled}
                        value={value ?? language.value.toString()}
                        key={language.value}
                        onSelect={() => {
                          form.setValue(name, (form.getValues(name) == language.value ? "" : language.value));
                          if (onChange) onChange(language.value);
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

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@client/components/ui/command";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/components/ui/form";
import { cn } from "@client/lib/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@client/components/ui/popover";
import { Button } from "@client/components/ui/button";
import { useFormContext } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";

export interface DataTableMultiselectProps {
  name: string;
  title: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: [];
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export default function MultiSelectInput({
  name,
  title,
  disabled = false,
  options,
  description,
  errorMessage,
  defaultValue = [],
}: DataTableMultiselectProps) {
  const form = useFormContext();
  const selectedValues = form.watch(name, defaultValue);

  return (
    <FormField
      control={form.control}
      name="info"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">{title}</FormLabel>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  disabled={disabled}
                  className="w-36 justify-between px-5"
                >
                  {title}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={`Search ${title.toLowerCase()}...`}
                  />
                  <CommandList>
                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const updatedSelectedValues = isSelected
                              ? selectedValues.filter(
                                  (value: string) => value !== option.value
                                )
                              : [...selectedValues, option.value];
                            form.setValue(name, updatedSelectedValues);
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className={cn("h-4 w-4")} />
                          </div>
                          <span>{option.label}</span>
                        </CommandItem>
                      );
                    })}
                    {selectedValues.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandItem
                          onSelect={() => form.setValue(name, [])}
                          className="justify-center text-center"
                        >
                          Clear selections
                        </CommandItem>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && (
              <FormDescription className="text-base">
                {description}
              </FormDescription>
            )}
            {errorMessage && (
              <FormMessage className="text-base">{errorMessage}</FormMessage>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}

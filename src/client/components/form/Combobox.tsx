import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@client/lib/cn";
import { Button } from "@client/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@client/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@client/components/ui/popover";
import { ComboboxItem } from "@client/types/form/ComboboxItem";

interface ComboboxProps {
  items: ComboboxItem[];
  placeholder?: string;
  title?: string;
  onChange?: (value: string) => void;
}

export function Combobox({ items, placeholder, onChange, title }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      {title && <p className="text-base">{title}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between truncate"
          >
            {value
              ? items.find((item) => item.value == value)?.title
              : "Search..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  value={item.title}
                  key={item.title}
                  onSelect={(currentValue) => {
                    const item = items.find((i) => i.title.toLowerCase() == currentValue)
                    setOpen(false);
                    if(item) {
                      console.log(item.value, value)
                      setValue(item.value == value ? "" : item.value)
                      if (onChange) onChange(item.value == value ? "" : item.value);
                    } 
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

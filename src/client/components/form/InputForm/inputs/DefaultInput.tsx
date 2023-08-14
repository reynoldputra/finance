import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormDescription,
  FormMessage,
} from "@client/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@client/components/ui/input";

interface DefaultInputProps {
  name: string;
  title?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  className?: string;
  onChange?: (v : string | number) => void
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  name,
  title,
  description,
  value,
  errorMessage,
  disabled,
  type,
  className,
  placeholder,
  onChange
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className ?? "ml-1 "}>
          {title && <FormLabel className="text-base">{title}</FormLabel>}
          <FormControl>
            <Input
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              value={field.value ?? (value && (typeof type == "number" ? parseInt(value?.toString()) : value)) ?? ""}
              onChange={(e) => {
                console.log(typeof type)
                const valParse = type == "number" ? parseInt(e.target.value) : e.target.value
                field.onChange(valParse)
                if(onChange) onChange(valParse)
              }}
              onBlur={field.onBlur}
            />
          </FormControl>
          {description && <FormDescription className="text-base">{description}</FormDescription>}
          {errorMessage && <FormMessage className="text-base">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default DefaultInput;

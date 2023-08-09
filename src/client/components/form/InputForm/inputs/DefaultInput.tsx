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
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  className?: string;
  onChange?: (v : string) => void
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  name,
  title,
  description,
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
        <FormItem className={className ?? " "}>
          {title && <FormLabel className="text-base">{title}</FormLabel>}
          <FormControl>
            <Input
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value)
                if(onChange) onChange(e.target.value)
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

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
  title: string;
  description?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  name,
  title,
  description,
  errorMessage,
  type,
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <Input
              type={type}
              value={field.value ?? ""}
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
};

export default DefaultInput;

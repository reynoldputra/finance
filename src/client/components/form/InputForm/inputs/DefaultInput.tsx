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
  title: string;
  description?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  title,
  description,
  errorMessage,
  type,
}) => {
  const form = useFormContext();
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
};

export default DefaultInput;

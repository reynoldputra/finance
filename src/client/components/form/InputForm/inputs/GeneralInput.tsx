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

interface DefaultInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  description?: string;
  errorMessage?: string;
  name : string
}

const GeneralInput: React.FC<DefaultInputProps> = ({
  title,
  description,
  errorMessage,
  name,
  disabled,
  type,
  placeholder,
  ...rest
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">{title}</FormLabel>
          <FormControl>
            <Input
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              {...rest}
            />
          </FormControl>
          {description && <FormDescription className="text-base">{description}</FormDescription>}
          {errorMessage && <FormMessage className="text-base">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default GeneralInput;

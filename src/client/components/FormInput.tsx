import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormDescription,
  FormMessage,
} from "@client/components/ui/form";
import * as z from "zod";
import { Input } from "@client/components/ui/input";
import { Control } from "react-hook-form";
import { formSchema } from "./Home/Form";

interface CustomFormFieldProps {
  label: string;
  description?: string;
  errorMessage?: string;
  type: string;
  control: Control<UseFormValues>; 
}

type UseFormValues = z.infer<typeof formSchema>; 

const InputFormField: React.FC<CustomFormFieldProps> = ({
  label,
  description,
  errorMessage,
  type,
  control,
}) => {
  return (
    <FormField
      control={control}
      name={label}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default InputFormField;

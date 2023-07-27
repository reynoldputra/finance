import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../InputForm";

// combobox value
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export const formSchema = z.object({
  Username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  Total: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  Date: z.date(),
  Language: z.string(),
});

export function FormComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Username: "inu",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          control={form.control}
          type="text"
          label="Username"
          description="This is your public display name."
        />
        <InputForm
          control={form.control}
          type="number"
          label="Total"
          description="This is Your Total"
        />
        <InputForm label="Date" type="datepicker" control={form.control} />
        <InputForm
          label="Language"
          type="combobox"
          control={form.control}
          options={languages}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../form/InputForm/InputForm";

const languages = [
  { title: "English", value: "en" },
  { title: "French", value: "fr" },
  { title: "German", value: "de" },
  { title: "Spanish", value: "es" },
  { title: "Portuguese", value: "pt" },
  { title: "Russian", value: "ru" },
  { title: "Japanese", value: "ja" },
  { title: "Korean", value: "ko" },
  { title: "Chinese", value: "zh" },
] as const;

const formSchema = z.object({
  Username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  Total: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  Date: z.date(),
  Language: z.string(),
});

export function ExampleForm() {
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
          name="Username"
          type="text"
          title="Username"
          description="This is your public display name."
        />
        <InputForm
          name="Total"
          type="number"
          title="Total"
          description="This is Your Total"
        />
        <InputForm name="Date" title="Date" type="datepicker" />
        <InputForm name="Language" title="Language" type="combobox" options={languages} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

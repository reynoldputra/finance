import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import * as z from "zod";
import InputForm from "./InputForm";

interface CreateCustomerFormProps {
  handleDelete: () => void;
  currName: string;
  confirmTitle?: string;
}

export default function ConfirmDeleteForm({
  handleDelete,
  currName,
  confirmTitle = "Delete",
}: CreateCustomerFormProps) {
  const formSchema = z.object({
    name: z.string().refine((value) => value === currName, {
      message: "Please enter correctly",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.name === currName) {
      handleDelete();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm name="name" type="text" title="" />
        <span className="text-red-500 text-base">
          {form.formState.errors.name?.message}
        </span>
        <div className="flex gap-x-3 mt-1">
          <Dialog.Close>
            <Button className="text-base" variant={"outline"}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="text-base" variant={"destructive"} type="submit">
            {confirmTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
}

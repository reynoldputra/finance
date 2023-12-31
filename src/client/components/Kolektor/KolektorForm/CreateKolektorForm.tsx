import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { createKolektorInput } from "@server/collections/kolektor/kolektorSchema";
import { TCreateCustomerInput } from "@server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";
import cuid from "cuid";
import { useToast } from "@client/components/ui/use-toast";

interface CreateKolektorFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateKolektorForm({ setOpen }: CreateKolektorFormProps) {
  const { toast } = useToast();

  const form = useForm<TCreateCustomerInput>({
    resolver: zodResolver(createKolektorInput),
    defaultValues: {
      nama: "inu",
    },
  });

  const utils = trpc.useContext();

  const createKolektorMutation = trpc.kolektor.createKolektor.useMutation({
    onSuccess: () => {
      utils.kolektor.invalidate();
    },
  });

  async function onSubmit(values: TCreateCustomerInput) {
    try {
      if (!values.id) {
        values.id = cuid();
      }
      const { data, status } = await createKolektorMutation.mutateAsync(values);
      if (status && data) {
        setOpen(false);
        toast({
          description: `Kolektor ${data.nama} successfully created`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create kolektor, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          name="nama"
          type="text"
          title="Nama Kolektor"
          description="Input Nama Kolektor Here"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import {
  TCreateCustomerInput,
  createCustomerInput,
} from "@server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";
import cuid from "cuid";
import { useToast } from "@client/components/ui/use-toast";
import Modal from "@client/components/modal/Modal";

interface Option {
  title: string;
  value: string;
}

interface CreateCustomerFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateCustomerForm({ setOpen }: CreateCustomerFormProps) {
  const { toast } = useToast();

  const form = useForm<TCreateCustomerInput>({
    resolver: zodResolver(createCustomerInput),
    defaultValues: {
      nama: "inu",
      id: "",
    },
  });

  const data = trpc.kolektor.getAllKolektor.useQuery();
  const result = data.data?.data ?? [];
  const kolektors: Option[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const utils = trpc.useContext();

  const createCustomerMutation = trpc.customer.createCustomer.useMutation({
    onSuccess: () => {
      utils.customer.invalidate();
    },
  });

  async function onSubmit(values: TCreateCustomerInput) {
    try {
      if (!values.id) {
        values.id = cuid();
      }
      const { data, status } = await createCustomerMutation.mutateAsync(values);
      if (status && data) {
        setOpen(false);
        toast({
          description: `Customer ${data.nama} successfully created`,
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          name="id"
          type="text"
          title="ID Kolektor"
          description="ID kolektor will be generated automatically when empty"
        />
        <InputForm
          name="nama"
          type="text"
          title="Nama Customer"
          description="Input Nama Kolektor Here"
        />
        <InputForm
          name="kolektorId"
          type="combobox"
          title="Nama Kolektor"
          description="Choose Nama Kolektor Here"
          options={kolektors}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
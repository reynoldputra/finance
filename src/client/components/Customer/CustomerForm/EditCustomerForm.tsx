import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import {
  TUpdateCustomerInput,
  updateCustomerInput,
} from "@server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";

interface Option {
  title: string;
  value: string;
}

interface customerData {
  id: string;
  name: string;
  kolektorId: string;
}

interface EditCustomerProps {
  customerData: customerData;
}

export default function EditCustomerForm({ customerData }: EditCustomerProps) {
  const form = useForm<TUpdateCustomerInput>({
    resolver: zodResolver(updateCustomerInput),
    defaultValues: {
      nama: customerData.name,
      id: customerData.id,
      kolektorId: customerData.kolektorId,
    },
  });

  const data = trpc.kolektor.getAllKolektor.useQuery();
  const result = data.data?.data ?? [];
  const kolektors: Option[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const updateCustumerMutation = trpc.customer.updateCustomer.useMutation();

  async function onSubmit(values: TUpdateCustomerInput) {
    try {
      const { data } = await updateCustumerMutation.mutateAsync(values);
      if (data) {
        console.log("Customer berhasil dibuat:", data);
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
          title="ID Customer"
          description="Edit ID Customer Here"
        />
        <InputForm
          name="nama"
          type="text"
          title="Nama Customer"
          description="Edit Nama Customer Here"
        />
        <InputForm
          name="kolektorId"
          type="combobox"
          title="Nama Kolektor"
          description="Change Nama Kolektor Here"
          options={kolektors}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

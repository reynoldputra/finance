import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import {
  TCreateCustomerInput,
  createCustomerInput,
} from "../../../../server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";
import cuid from "cuid";

export function CustomerForm() {
  const form = useForm<TCreateCustomerInput>({
    resolver: zodResolver(createCustomerInput),
    defaultValues: {
      nama: "inu",
      id: "",
    },
  });

  const createCustomerMutation = trpc.customer.createCustomer.useMutation();

  async function onSubmit(values: TCreateCustomerInput) {
    try {
      if (!values.id) {
        values.id = cuid();
      }
      const { data } = await createCustomerMutation.mutateAsync(values);
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
        name="kolektor"
        type="combobox"
        title="Nama Kolektor"
        description="Choose Nama Kolektor Here"
        // options={}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

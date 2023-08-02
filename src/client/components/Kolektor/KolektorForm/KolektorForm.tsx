import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { createKolektorInput } from "../../../../server/collections/kolektor/kolektorSchema";
import { TCreateCustomerInput } from "../../../../server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";
import cuid from "cuid";

export function KolektorForm() {
  const form = useForm<TCreateCustomerInput>({
    resolver: zodResolver(createKolektorInput),
    defaultValues: {
      nama: "inu",
      id: "",
    },
  });

  const createKolektorMutation = trpc.kolektor.createKolektor.useMutation();

  async function onSubmit(values: TCreateCustomerInput) {
    try {
      if (!values.id) {
        values.id = cuid();
      }
      const { data } = await createKolektorMutation.mutateAsync(values);
      if (data) {
        console.log("Kolektor berhasil dibuat:", data);
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
          title="Nama Kolektor"
          description="Input Nama Kolektor Here"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
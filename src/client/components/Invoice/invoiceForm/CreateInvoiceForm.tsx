import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { createInvoiceInput, TCreateInvoiceInput } from "@server/collections/invoice/invoiceSchema";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import cuid from "cuid";

interface CreateInvoiceFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateInvoiceForm({ setOpen }: CreateInvoiceFormProps) {
  const { toast } = useToast();

  const form = useForm<TCreateInvoiceInput>({
    resolver: zodResolver(createInvoiceInput)
  });

  const res = trpc.customer.customerOption.useQuery();
  const result = res.data ?? [];
  const custemers: ComboboxItem[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const createInvoiceMutation = trpc.invoice.createInvoice.useMutation();
  const utils = trpc.useContext()

  async function onSubmit(values: TCreateInvoiceInput) {
    try {
      const { data } = await createInvoiceMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Invoice ${data.id} successfully created`,
          variant: "success",
          className: "text-white text-base font-semibold"
        });
        setOpen(false);
        utils.invoice.invalidate()
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create invoice, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  const register = form.register;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm {...register("transaksiId")} type="text" title="Transaksi ID" />
        <InputForm
          {...register("customerId")}
          type="combobox"
          title="Nama Customer"
          options={custemers}
        />
        <InputForm {...register("namaSales")} name="namaSales" type="text" title="Nama Sales" />
        <InputForm
          {...register("tanggalTransaksi")}
          name="tanggalTransaksi"
          type="datepicker"
          title="Tanggal Transaksi"
        />
        <InputForm {...register("total")} name="total" type="text" title="Total" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

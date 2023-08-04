import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { createInvoiceInput, TCreateInvoiceInput, TUpdateInvoiceInput, updateInvoiceInput } from "@server/collections/invoice/invoiceSchema";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import { TInvoiceSchema } from "../InvoiceTable/data/schema";
import { Row } from "@tanstack/react-table";

interface UpdateInvoiceFormProps {
  setOpen : React.Dispatch<React.SetStateAction<boolean>>;
  row : Row<TInvoiceSchema>
}

export function UpdateInvoiceForm({ setOpen, row }: UpdateInvoiceFormProps) {
  const { toast } = useToast();

  const res = trpc.customer.customerOption.useQuery();
  const result = res.data ?? [];
  const custemers: ComboboxItem[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const form = useForm<TUpdateInvoiceInput>({
    resolver: zodResolver(updateInvoiceInput),
    defaultValues: {
      id : row.original.id,
      transaksiId : row.original.transaksiId,
      customerId : custemers.find((c) => c.title == row.original.namaCustomer)?.value,
      total : row.original.total,
      tanggalTransaksi : row.original.tanggalTransaksi,
      namaSales : row.original.namaSales,
    }
  });

  const updateInvoiceMutation = trpc.invoice.updateInvoice.useMutation();
  const utils = trpc.useContext()

  async function onSubmit(values: TCreateInvoiceInput) {
    try {
      const { data } = await updateInvoiceMutation.mutateAsync(values);
      if (data) {
        setOpen(false);
        toast({
          description: `Invoice ${data.transaksiId} successfully updated`,
        });
        utils.invoice.invalidate()
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
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

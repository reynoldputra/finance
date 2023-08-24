import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import { Row } from "@tanstack/react-table";
import { TReturSchema } from "../ReturTable/data/schema";
import {
  TUpdateReturInput,
  updateReturInput,
} from "../../../../server/collections/retur/returSchema";
import { useState, useEffect } from "react";

interface UpdateReturFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<TReturSchema>;
}
const typeOptions: ComboboxItem[] = [
  { title: "Retur", value: "Retur" },
  { title: "Retur Tarik Barang", value: "Retur Tarik Barang " },
];

export function UpdateReturForm({ setOpen, row }: UpdateReturFormProps) {
  const { toast } = useToast();

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];
  const invoices: ComboboxItem[] = result.map((item) => ({
    title: item.transaksiId,
    value: item.id,
  }));

  useEffect(() => {
    if (invoices) {
      const invoiceId = invoices
        .find((i) => i.value == row.original.invoiceId)
        ?.value.toString();
      form.setValue("invoiceId", invoiceId ?? "");
    }
  }, [res.status]);

  const form = useForm<TUpdateReturInput>({
    resolver: zodResolver(updateReturInput),
    defaultValues: {
      id: row.original.id,
      transaksiId: row.original.transaksiId,
      tanggalTransaksi: row.original.tanggalTransaksi,
      noRetur: row.original.noRetur,
      type: row.original.type,
      total: row.original.total,
    },
  });

  const updateReturMutation = trpc.retur.updateRetur.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TUpdateReturInput) {
    try {
      const { data } = await updateReturMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Retur successfully updated`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        setOpen(false);
        utils.retur.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  }

  const register = form.register;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          {...register("transaksiId")}
          type="text"
          title="Transaksi ID"
        />
        <InputForm {...register("noRetur")} type="text" title="Nomor Retur" />
        <InputForm
          {...register("tanggalTransaksi")}
          type="datepicker"
          title="Tanggal Transaksi"
        />
        <InputForm
          {...register("invoiceId")}
          type="combobox"
          title="Invoice Id"
          options={invoices}
        />
        <InputForm
          {...register("total")}
          name="total"
          type="number"
          title="Total"
        />
        <InputForm
          {...register("type")}
          type="combobox"
          title="Tipe"
          options={typeOptions}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

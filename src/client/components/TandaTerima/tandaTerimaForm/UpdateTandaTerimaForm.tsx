import { Row } from "@tanstack/react-table";
import React from "react";
import { TTandaTerimaTable } from "../tandaTerimaTable/data/schema";
import { useToast } from "@client/components/ui/use-toast";
import { useForm } from "react-hook-form";
import {
  TUpdateTandaTerimaInput,
  updateTandaTerimaInput,
} from "@server/collections/tandaTerima/tandaTerimaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@client/lib/trpc";
import InputForm from "@client/components/form/InputForm";
import { Button } from "@client/components/ui/button";
import { Form } from "@client/components/ui/form";

interface UpdateTandaTerimaFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<TTandaTerimaTable>;
}

export default function UpdateTandaTerimaForm({
  row,
  setOpen,
}: UpdateTandaTerimaFormProps) {
  const { toast } = useToast();
  const utils = trpc.useContext();

  const form = useForm<TUpdateTandaTerimaInput>({
    resolver: zodResolver(updateTandaTerimaInput),
    defaultValues: {
      id: row.original.id,
      tanggalTT: row.original.tanggalTT,
    },
  });

  const invoice = trpc.tandaTerima.getInvoiceByNameFiltered.useQuery(
    row.original.namaCustomer
  );
  const invoiceData = invoice.data?.data ?? [];
  const invoiceOption = invoiceData.map((item) => ({
    label: item.transaksiId,
    value: item.id,
  }));

  const updateTandaTerimaMutation =
    trpc.tandaTerima.updateTandaTerima.useMutation();
  async function onSubmit(values: TUpdateTandaTerimaInput) {
    try {
      const { data, status } = await updateTandaTerimaMutation.mutateAsync(
        values
      );
      if (data && status) {
        toast({
          description: "Tanda terima successfully updated",
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        setOpen(false);
        utils.tandaTerima.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create TandaTerima, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-lg font-semibold"> Update Tanda Terima</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <InputForm name="id" title="ID Tanda Terima" type="text" />
        <InputForm
          name="tanggalTT"
          type="datepicker"
          title="Tanggal Tanda Terima"
        />
        <InputForm
          type="multiselect"
          title="Invoice ID"
          name="manyInvoiceId"
          multiOption={invoiceOption}
          defaultValue={row.original.invoices}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

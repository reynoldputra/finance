import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
  createPenagihanInput,
  TCreatePenagihanInput,
  TUpdatePenagihanInput,
  updatePenagihanInput,
} from "@client/../server/collections/penagihan/penagihanSchema";
import { TPenagihanTable } from "../PenagihanTable/data/schema";
import { Row } from "@tanstack/react-table";

interface UpdatePenagihanFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row : Row<TPenagihanTable>
}

export function UpdatePenagihanForm({ setOpen, row }: UpdatePenagihanFormProps) {
  const { toast } = useToast();

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];
  const invoices: ComboboxItem[] = result.map((item) => ({
    title: item.transaksiId,
    value: item.id,
  }));

  const form = useForm<TUpdatePenagihanInput>({
    resolver: zodResolver(updatePenagihanInput),
    defaultValues : {
      penagihanId : row.original.id,
      invoiceId : invoices.find((i) => i.title == row.original.transaksiId)?.value.toString() ?? "",
      tanggalTagihan : row.original.tanggalTagihan,
      kolektorId : row.original.kolektorId,
    }
  });

  const kolektor = trpc.kolektor.getAllKolektor.useQuery();
  const kolektorData = kolektor.data?.data ?? [];
  const kolektorOptions: ComboboxItem[] = kolektorData.map((k) => ({
    title: k.nama,
    value: k.id,
  }));

  const updatePenagihanMutation = trpc.penagihan.updatePenagihan.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TUpdatePenagihanInput) {
    console.log(values)
    try {
      const { data } = await updatePenagihanMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Penagihan successfully updated`,
        });
        setOpen(false);
        utils.penagihan.invalidate();
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
          {...register("invoiceId")}
          type="combobox"
          title="Invoice Id"
          options={invoices}
        />
        <InputForm
          {...register("kolektorId")}
          type="combobox"
          title="Kolektor"
          options={kolektorOptions}
        />
        <InputForm {...register("tanggalTagihan")} type="datepicker" title="Tanggal Tagihan" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

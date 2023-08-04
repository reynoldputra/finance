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
} from "@client/../server/collections/penagihan/penagihanSchema";

interface CreatePenagihanFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePenagihanForm({ setOpen }: CreatePenagihanFormProps) {
  const { toast } = useToast();

  const form = useForm<TCreatePenagihanInput>({
    resolver: zodResolver(createPenagihanInput),
  });

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];
  const invoices: ComboboxItem[] = result.map((item) => ({
    title: item.id,
    value: item.id,
  }));

  const kolektor = trpc.kolektor.getAllKolektor.useQuery();
  const kolektorData = kolektor.data?.data ?? [];
  const kolektorOptions: ComboboxItem[] = kolektorData.map((k) => ({
    title: k.nama,
    value: k.id,
  }));

  const createPenagihanMutation = trpc.penagihan.createPenagihan.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreatePenagihanInput) {
    try {
      const { data } = await createPenagihanMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Penagihan successfully created`,
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

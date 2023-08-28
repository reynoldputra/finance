import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import { useEffect, useState } from "react";
import { Combobox } from "@client/components/form/Combobox";
import {
  createReturInput,
  TCreateReturInput,
} from "../../../../server/collections/retur/returSchema";

interface CreateReturFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const typeOptions: ComboboxItem[] = [
  { title: "Retur", value: "Retur" },
  { title: "Retur Tarik Barang", value: "Retur Tarik Barang" },
  { title: "Retur Batal", value: "Retur Batal" },
];

export function CreateReturForm({ setOpen }: CreateReturFormProps) {
  const { toast } = useToast();
  const [invoiceOption, setInvoiceOption] = useState<ComboboxItem[]>();

  const form = useForm<TCreateReturInput>({
    resolver: zodResolver(createReturInput),
  });

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];
  let invoices: ComboboxItem[] = result.map((item) => ({
    title: item.transaksiId,
    value: item.id,
  }));
  useEffect(() => {
    setInvoiceOption(invoices);
  }, []);

  const createReturMutation = trpc.retur.createRetur.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreateReturInput) {
    try {
      const { data } = await createReturMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Penagihan successfully created`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        setOpen(false);
        utils.retur.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create retur, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
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
          options={invoiceOption}
        />
        <InputForm
          {...register("total")}
          name="total"
          type="number"
          title="Total"
        />
        <InputForm
          {...register("type")}
          title="Tipe"
          type="combobox"
          options={typeOptions}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

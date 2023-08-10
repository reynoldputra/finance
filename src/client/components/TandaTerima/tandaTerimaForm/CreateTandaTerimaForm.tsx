import { useEffect, useState } from "react";
import { useToast } from "@client/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TCreateTandaTerimaInput,
  createTandaTerimaInput,
} from "../../../../server/collections/tandaTerima/tandaTerimaSchema";
import { Form } from "@client/components/ui/form";
import { trpc } from "@client/lib/trpc";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import { Combobox } from "@client/components/form/Combobox";
import { Button } from "@client/components/ui/button";
import InputForm from "@client/components/form/InputForm";
import { MultiselectItem } from "@client/types/form/MultiselectItem";
import cuid from "cuid";

interface CreateTandaTerimaFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateTandaTerimaForm({
  setOpen,
}: CreateTandaTerimaFormProps) {
  const { toast } = useToast();
  const [cust, setCust] = useState<string>("");
  const [invoiceOptions, setInvoiceOptions] = useState<MultiselectItem[]>();

  const form = useForm<TCreateTandaTerimaInput>({
    resolver: zodResolver(createTandaTerimaInput),
  });

  const utils = trpc.useContext();

  const invoice = trpc.tandaTerima.getInvoiceByIdFiltered.useQuery(cust);
  const invoiceData = invoice.data?.data ?? [];

  useEffect(() => {
    if (invoiceData) {
      const invoiceOption = invoiceData.map((item) => ({
        label: item.transaksiId,
        value: item.id,
      }));
      setInvoiceOptions(invoiceOption);
      utils.tandaTerima.invalidate();
    }
  }, [cust, invoice.status]);

  const customer = trpc.customer.customerOption.useQuery();
  const custData = customer.data ?? [];
  const custOption: ComboboxItem[] = custData.map((c) => ({
    title: c.nama,
    value: c.id,
  }));

  const createTandaTerimaMutation =
    trpc.tandaTerima.createTandaTerima.useMutation();

  async function onSubmit(values: TCreateTandaTerimaInput) {
    try {
      if (!values.id) {
        values.id = cuid();
      }
      const { data, status } = await createTandaTerimaMutation.mutateAsync(
        values
      );
      if (data && status) {
        toast({
          description: `TandaTerima successfully created ${data} ${status}`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        setOpen(false);
        utils.tandaTerima.invalidate();
      }
      console.log(values);
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
      <h1 className="text-lg font-semibold">Add Tanda Terima</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <InputForm
          name="id"
          title="ID Tanda Terima"
          description="ID will be generated automatically when empty"
          type="text"
        />
        <p className="text-base font-semibold">Customer</p>
        <Combobox items={custOption} onChange={(e) => setCust(e)} />
        <InputForm
          name="manyInvoiceId"
          type="multiselect"
          title="Invoice Id"
          disabled={cust.length ? false : true}
          multiOption={invoiceOptions}
        />
        <InputForm
          type="datepicker"
          name="tanggalTT"
          title="Tanggal Tanda Terima"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

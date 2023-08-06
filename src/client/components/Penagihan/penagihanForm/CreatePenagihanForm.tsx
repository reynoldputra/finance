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
import { useEffect, useState } from "react";
import { Combobox } from "@client/components/form/Combobox";

interface CreatePenagihanFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePenagihanForm({ setOpen }: CreatePenagihanFormProps) {
  const { toast } = useToast();
  const [invoiceOption, setInvoiceOption] = useState<ComboboxItem[]>()

  const form = useForm<TCreatePenagihanInput>({
    resolver: zodResolver(createPenagihanInput),
  });

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];
  let invoices: ComboboxItem[] = result.map((item) => ({
    title: item.transaksiId,
    value: item.id,
  }));

  useEffect(() => {
    setInvoiceOption(invoices)
  }, [])

  const customer = trpc.customer.customerOption.useQuery();
  const custData = customer.data ?? [];
  const custOption: ComboboxItem[] = custData.map((c) => ({
    title: c.nama,
    value: c.id,
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
          variant: "success",
          className: "text-white text-base font-semibold"
        });
        setOpen(false);
        utils.penagihan.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create penagihan, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  const register = form.register;

  const [cust, setCust] = useState<string>("");
  
  const custDetail = trpc.customer.customerDetail.useQuery(cust)

  useEffect(() => {
    let newInvoice = result.filter((c) => c.customerId == cust);

    const invoices = newInvoice.map((inv) => ({
      title: inv.transaksiId,
      value: inv.id,
    }));

    setInvoiceOption(invoices)

  }, [cust]);


  useEffect(() => {
    if(custDetail.data) {
      form.setValue("kolektorId", custDetail.data.kolektorId)
    } else {
      form.resetField("kolektorId")
    }
  }, [custDetail.data])

  return (
    <Form {...form}>
      <h1 className="font-bold">Add penagihan</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm">Customer</p>
        <Combobox items={custOption} onChange={(e) => setCust(e)} />
        <InputForm
          {...register("invoiceId")}
          type="combobox"
          title="Invoice Id"
          disabled={cust.length ? false : true}
          options={invoiceOption}
        />
        <InputForm
          {...register("kolektorId")}
          disabled={cust.length ? false : true}
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

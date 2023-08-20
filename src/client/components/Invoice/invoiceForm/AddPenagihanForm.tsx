import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
  manyPenagihanInput,
  TCreatePenagihanInput,
  TManyPenagihanInput,
} from "@client/../server/collections/penagihan/penagihanSchema";
import { z } from "zod";
import { Table } from "@tanstack/react-table";
import { TInvoiceSchema } from "../InvoiceTable/data/schema";
import { useEffect, useState } from "react";

interface AddPenagihanFormProps<TData> {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  table: Table<TData>;
}

export function AddPenagihanForm({
  setOpen,
  table,
}: AddPenagihanFormProps<TInvoiceSchema>) {
  const { toast } = useToast();
  const [kolektorOptions, setKolektorOptions] = useState<ComboboxItem[]>([]);

  const selectedRows = table.getSelectedRowModel().rows;

  const customers = trpc.customer.customerTable.useQuery();
  const kolektors = trpc.kolektor.getAllKolektor.useQuery();
  const kolektorsQuery = kolektors.data?.data ?? [];

  const initValue: TManyPenagihanInput[] = selectedRows.map((r) => {
    const customerData = customers.data ?? [];
    const customer = customerData.find(
      (c) => c.nama == r.original.namaCustomer
    );
    return {
      invoiceId: r.original.id,
      kolektorId: customer?.kolektorId ?? "",
      tanggalTagihan: new Date(),
      status: r.original.status,
    };
  });

  const FormSchema = z.object({
    manyPenagihan: z.array(manyPenagihanInput),
  });

  type TFormSchema = z.infer<typeof FormSchema>;

  const form = useForm<TFormSchema>({
    resolver: zodResolver(
      z.object({
        manyPenagihan: z.array(manyPenagihanInput),
      })
    ),
  });

  const { fields } = useFieldArray({
    name: "manyPenagihan",
    control: form.control,
  });


  useEffect(() => {
    if (customers.data) {
      const initValue: TCreatePenagihanInput[] = selectedRows.map((r) => {
        const customerData = customers.data ?? [];
        const customer = customerData.find((c) => c.nama == r.original.namaCustomer);
        return {
          invoiceId: r.original.id,
          kolektorId: customer?.kolektorId ?? "",
          tanggalTagihan: new Date(),
        };
      });
      if (initValue) form.setValue("manyPenagihan", initValue);
    }
    if(kolektorsQuery){
      const kolektorsData: ComboboxItem[] = kolektorsQuery.map((item) => ({
        title: item.nama,
        value: item.id,
      }));
      console.log(kolektorsData);
      setKolektorOptions(kolektorsData)
    }
  }, [kolektors.status, customers.status]);

  const createManyPenagihanMutation =
    trpc.penagihan.createManyPenagihan.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TFormSchema) {
    try {
      const { data } = await createManyPenagihanMutation.mutateAsync(
        values.manyPenagihan
      );
      if (data) {
        toast({
          description: `${data.length} penagihan successfully created`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        utils.invoice.invalidate();
        setOpen(false);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col gap-y-4"
      >
        {fields.map((field, idx) => {
          return (
            <div key={idx} className="flex flex-col gap-y-2">
              <p
                className={`font-bold ${
                  selectedRows.find((r) => r.original.id === field.invoiceId)
                    ?.original.status === "LUNAS"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {
                  selectedRows.find((r) => r.original.id == field.invoiceId)
                    ?.original.transaksiId
                }
              </p>
              <InputForm
                {...register(`manyPenagihan.${idx}.tanggalTagihan`)}
                type="datepicker"
                title="Tanggal Penagihan"
              />
              <InputForm
                {...register(`manyPenagihan.${idx}.kolektorId`)}
                type="combobox"
                options={kolektorOptions}
                title="Kolektor"
              />
              {selectedRows.find((r) => r.original.id == field.invoiceId)
                ?.original.status === "LUNAS" && (
                <p className="font-semibold text-red-600">
                  This Invoice is marked as LUNAS
                </p>
              )}
            </div>
          );
        })}
        <Button
          disabled={fields.some((field) => field.status === "LUNAS")}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

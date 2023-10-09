import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
  applyToAllInput,
  manyPenagihanInput,
  TApplyToAllInput,
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

  const selectedRows = table.getGroupedSelectedRowModel().rows;

  const customers = trpc.customer.customerTable.useQuery();
  const kolektors = trpc.kolektor.getAllKolektor.useQuery();
  const kolektorsQuery = kolektors.data?.data ?? [];

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

  const scdForm = useForm<TApplyToAllInput>({
    resolver: zodResolver(applyToAllInput),
  });

  const handleApplyToAll = (values: TApplyToAllInput) => {
    try {
      fields.forEach((field, idx) => {
        form.setValue(`manyPenagihan.${idx}.kolektorId`, values.kolektorId);
        form.setValue(
          `manyPenagihan.${idx}.tanggalTagihan`,
          values.tanggalTagihan
        );
      });
      toast({
        description: `Successfully apply to selected penagihan`,
        variant: "success",
        className: "text-white text-base font-semibold",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed apply to selected penagihan`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  };

  const { fields } = useFieldArray({
    name: "manyPenagihan",
    control: form.control,
  });

  const formWatch = form.watch();

  useEffect(() => {
    const today = new Date()
    today.setHours(0,0,0,0)

    if (customers.data) {
      const initValue: TManyPenagihanInput[] = selectedRows.map((r) => {
        const customerData = customers.data ?? [];
        const customer = customerData.find(
          (c) => c.nama == r.original.namaCustomer
        );
        return {
          invoiceId: r.original.id,
          kolektorId: customer?.kolektorId ?? "",
          tanggalTagihan: today,
          status: r.original.status,
        };
      });
      if (initValue) form.setValue("manyPenagihan", initValue);
    }
    if (kolektorsQuery) {
      const kolektorsData: ComboboxItem[] = kolektorsQuery.map((item) => ({
        title: item.nama,
        value: item.id,
      }));
      setKolektorOptions(kolektorsData);
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
    <div className="flex flex-col">
      <div className="grid grid-cols-12 mb-3 gap-y-5">
        <p className="mx-auto col-span-3 font-bold text-xl">ID Transaksi</p>
        <p className="mx-auto col-span-5 font-bold text-xl">
          Tanggal Penagihan
        </p>
        <p className="mx-auto col-span-4 font-bold text-xl">Kolektor</p>
      </div>
      <Form {...scdForm}>
        <form
          className="grid grid-cols-12 items-center mb-8"
          onSubmit={scdForm.handleSubmit(handleApplyToAll)}
        >
          <Button
            type="submit"
            variant={"secondary"}
            className="w-32 mx-auto col-span-3"
          >
            Apply to All
          </Button>
          <div className="col-span-5">
            <InputForm
              {...scdForm.register(`tanggalTagihan`)}
              type="datepicker"
              title=""
            />
          </div>
          <div className="col-span-4">
            <InputForm
              {...scdForm.register(`kolektorId`)}
              type="combobox"
              options={kolektorOptions}
              title=""
            />
          </div>
        </form>
      </Form>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-5"
        >
          {fields.map((field, idx) => {
            return (
              <div key={idx}>
                <div className="grid grid-cols-12 gap-x-3 items-center justify-center">
                  <p
                    className={`font-bold mx-auto col-span-3 ${
                      selectedRows.find(
                        (r) => r.original.id === field.invoiceId
                      )?.original.status === "LUNAS"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {
                      selectedRows.find((r) => r.original.id == field.invoiceId)
                        ?.original.transaksiId
                    }
                  </p>
                  <div className="col-span-5">
                    <InputForm
                      {...register(`manyPenagihan.${idx}.tanggalTagihan`)}
                      type="datepicker"
                      title=""
                    />
                  </div>
                  <div className="col-span-4">
                    <InputForm
                      {...register(`manyPenagihan.${idx}.kolektorId`)}
                      type="combobox"
                      options={kolektorOptions}
                      title=""
                    />
                  </div>
                </div>
                {selectedRows.find((r) => r.original.id == field.invoiceId)
                  ?.original.status === "LUNAS" && (
                  <p className="font-semibold text-red-600 mx-auto">
                    This Invoice is marked as LUNAS
                  </p>
                )}
              </div>
            );
          })}
          <Button
            disabled={formWatch.manyPenagihan?.some(
              (entry) => entry.status === "LUNAS" || entry.kolektorId === ""
            )}
            type="submit"
            className="px-4 py-2 ml-8 mt-2 w-32"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

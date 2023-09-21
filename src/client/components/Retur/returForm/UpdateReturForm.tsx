import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import { useEffect, useState } from "react";
import {
  createReturInvoiceInput,
  TCreateReturInvoiceInput
} from "@server/collections/retur/returSchema";
import { idr } from "@client/lib/idr";
import { Row } from "@tanstack/react-table";
import ComboboxInput from "@client/components/form/InputForm/inputs/ComboboxInput";
import { PlusIcon, Trash2 } from "lucide-react";
import { TReturSchema } from "../ReturTable/data/schema";

interface CreateReturFormProps<TData> {
  row: Row<TData>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const typeOptions: ComboboxItem[] = [
  { title: "Retur", value: "Retur" },
  { title: "Retur Tarik Barang", value: "Retur Tarik Barang" },
  { title: "Retur Batal", value: "Retur Batal" },
];

export function UpdateReturForm({ setOpen, row }: CreateReturFormProps<TReturSchema>) {
  const { toast } = useToast();
  const [invoiceOption, setInvoiceOption] = useState<ComboboxItem[]>([]);
  const [customerOption, setCustomerOption] = useState<ComboboxItem[]>([]);
  const [customer, setCustomer] = useState(row.original.customerId)

  const returData = row.original
  const oldInv = returData.invoice.map(v => ({
    invoiceId : v.invoiceId,
    total : v.total
  }))
  const form = useForm<TCreateReturInvoiceInput>({
    resolver: zodResolver(createReturInvoiceInput),
    defaultValues : {
      type : returData.type,
      tanggalTransaksi : returData.tanggalTransaksi,
      noRetur : returData.noRetur,
      invoice : oldInv
    }
  });

  const formcust = useForm<{ name: string }>({
    defaultValues : {
      name : row.original.customerId
    }
  });

  const resCustomer = trpc.customer.customerOption.useQuery();
  const resultCustomer = resCustomer.data ?? []

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];


  useEffect(() => {
    let invoices: ComboboxItem[] = []
    if (result) {
      result.forEach(item => {
        if (item.status != "LUNAS" && item.customerId == customer) {
          invoices.push({
            title: item.transaksiId + ` (${idr(item.sisa)})`,
            value: item.id,
          })
        }
      })
    } 
    setInvoiceOption(invoices)
  }, [res.status, customer])

  useEffect(() => {
    if (resultCustomer) {
      const custOpt = resultCustomer.map(v => ({
        title: v.nama,
        value: v.id
      }))
      setCustomerOption(custOpt)
    }
  }, [resCustomer.status])


  const updateRetur = trpc.retur.updateRetur.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreateReturInvoiceInput) {
    try {
      const { data } = await updateRetur.mutateAsync(values);
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
      toast({
        description: `Failed to create retur, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  const register = form.register;
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: "invoice",
    control: form.control,
  });

  const addField = () => {
    append({ invoiceId: "", total: 0 });
  };

  return (
    <>
      <Form {...formcust}>
        <form>
          <ComboboxInput name="name" options={customerOption ?? []} title="Customer Name" onChange={(v) => setCustomer(v)} />
        </form>
      </Form>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-60">
            <InputForm {...register("noRetur")} type="text" title="Nomor Retur" />
          </div>
          <InputForm
            {...register("tanggalTransaksi")}
            type="datepicker"
            title="Tanggal Transaksi"
          />
          <InputForm
            {...register("type")}
            title="Tipe"
            type="combobox"
            options={typeOptions}
          />
          <div>
            <p className="mt-4 mb-2">Invoice</p>
            {fields.map((field, idx) => (
              <div className="flex items-end gap-4">
                <div>
                  <p className="mb-2">Invoice Id</p>
                  <ComboboxInput width={300} name={`invoice.${idx}.invoiceId`} options={invoiceOption} />
                </div>
                <InputForm
                  {...register(`invoice.${idx}.total`)}
                  type="number"
                  title="Total"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(idx)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              type="button"
              onClick={addField}
            >
              <PlusIcon />
            </Button>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

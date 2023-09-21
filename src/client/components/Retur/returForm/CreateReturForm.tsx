import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import ComboboxInput from "@client/components/form/InputForm/inputs/ComboboxInput";
import { PlusIcon, Trash2 } from "lucide-react";
import { Textarea } from "@client/components/ui/textarea";
import ComboboxNew from "@client/components/form/ComboboxNew";
import DateInput from "@client/components/form/InputForm/inputs/DateInput";
import DefaultInput from "@client/components/form/InputForm/inputs/DefaultInput";

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
  const [invoiceOption, setInvoiceOption] = useState<ComboboxItem[]>([]);
  const [customerOption, setCustomerOption] = useState<ComboboxItem[]>([]);
  const [customer, setCustomer] = useState("")

  const form = useForm<TCreateReturInvoiceInput>({
    resolver: zodResolver(createReturInvoiceInput),
  });

  const formcust = useForm<{ name: string }>();

  const resCustomer = trpc.customer.customerOption.useQuery();
  const resultCustomer = resCustomer.data ?? []

  const res = trpc.invoice.getInvoices.useQuery();
  const result = res.data?.data ?? [];


  useEffect(() => {
    let invoices: ComboboxItem[] = []
    if (result) {
      console.log(customer)
      console.log(result)
      result.forEach(item => {
        if (item.status != "LUNAS" && item.customerId == customer) {
          console.log("test")
          invoices.push({
            title: item.transaksiId + ` (${idr(item.sisa)})`,
            value: item.id,
          })
        }
      })
    }
    console.log(invoices)
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


  const createReturMutation = trpc.retur.createRetur.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreateReturInvoiceInput) {
    try {
      const { data } = await createReturMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Retur successfully created`,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <p>Customer Name</p>
          <ComboboxNew items={customerOption ?? []} onChange={(v) => setCustomer(v)} />
          <div className="w-60">
            <DefaultInput name="noRetur" type="text" title="Nomor Retur" />
          </div>
          <DateInput
            {...register("tanggalTransaksi")}
            title="Tanggal Transaksi"
          />
          <ComboboxInput
            name="type"
            title="Tipe"
            options={typeOptions}
          />
          <p>Keterangan (opsional)</p>
          <Textarea
            {...register("keterangan")}
          />
          <div>
            <p className="mt-4 mb-2">Invoice</p>
            {fields.map((field, idx) => (
              <div className="flex items-end gap-4" key={idx}>
                <div>
                  <p className="mb-2">Invoice Id</p>
                  <ComboboxInput width={300} name={`invoice.${idx}.invoiceId`} options={invoiceOption} />
                </div>
                <DefaultInput
                  name={`invoice.${idx}.total`}
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

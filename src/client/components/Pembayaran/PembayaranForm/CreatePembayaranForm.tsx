import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import Modal from "@client/components/modal/Modal";
import { createInvoiceInput, TCreateInvoiceInput } from "@server/collections/invoice/invoiceSchema";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import cuid from "cuid";
import {
  createPembayaranWithCarabayarInput,
  TCreatePembayaranInput,
} from "@client/../server/collections/pembayaran/pembayaranSchema";
import { useEffect, useState } from "react";
import { dmyDate } from "@client/lib/dmyDate";
import { Combobox } from "@client/components/form/Combobox";
import { RadioGroup, RadioGroupItem } from "@client/components/ui/radio-group";
import { Label } from "@client/components/ui/label";
import { PlusIcon, PlusSquare, PlusSquareIcon, Trash } from "lucide-react";

interface ModalFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePembayaranForm({ setOpen }: ModalFormProps) {
  const { toast } = useToast();
  const [penagihanOption, setPenagihanOption] = useState<ComboboxItem[]>();
  const [currCust, setCurrentCust] = useState("");
  const [metode, setMetode] = useState(1);
  const [totalCarabayar, setTotalcarabayar] = useState(0);
  const [totalDistribusi, setTotalDistirbusi] = useState(0);

  const penagihan = trpc.penagihan.getAllPenagihan.useQuery();
  const penagihanData = penagihan.data?.data ?? [];
  const penagihanItems: ComboboxItem[] = penagihanData.map((k) => {
    const date = dmyDate(k.tanggalTagihan);
    return {
      title: `${k.transaksiId}-${date}`,
      value: k.id,
    };
  });

  useEffect(() => {
    setPenagihanOption(penagihanItems);
  }, []);

  const form = useForm<TCreatePembayaranInput>({
    resolver: zodResolver(createPembayaranWithCarabayarInput),
    defaultValues: {
      distribusi: [{ penagihanId: "", total: 0 }],
      carabayar : {
        pembayaran : {}
      }
    },
  });

  const res = trpc.customer.customerOption.useQuery();
  const result = res.data ?? [];
  const custemers: ComboboxItem[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  useEffect(() => {
    const filteredPenagihan = penagihanData.filter((p) => p.customerId == currCust && p.status == "WAITING");
    const penagihanItems: ComboboxItem[] = filteredPenagihan.map((p) => {
      const date = dmyDate(p.tanggalTagihan);
      return {
        title: `${p.transaksiId} ${date}`,
        value: p.id,
      };
    });

    setPenagihanOption(penagihanItems);
  }, [currCust]);

  const createPembayaranMutation = trpc.pembayaran.createPembayaran.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreatePembayaranInput) {
    try {
      console.log(values)
      const { data } = await createPembayaranMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `${data.terbayar} invoice terbayar`,
          variant: "success",
          className: "text-white text-base font-semibold"
        });
        setOpen(false);
        utils.carabayar.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to create pembayaran, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  const register = form.register;

  const { fields: distribusiFields, append, remove } = useFieldArray({
    name: "distribusi",
    control: form.control,
  });

  const addDistribusiField = () => {
    append({penagihanId : "", total : 0})
  }

  const watchFIelds = form.watch(["distribusi", "carabayar.total"])

  useEffect(() => {
    const subscription = form.watch((value, {name, type}) => {
      if(value.carabayar?.total) setTotalcarabayar(value.carabayar?.total)
      if(value.distribusi) {
        let totaldist = 0;
        for(let idx in value.distribusi) {
          let valnumber = value.distribusi[idx]?.total ?? 0
          let valstr = valnumber.toString()
          totaldist += parseInt(valstr)
        }
        setTotalDistirbusi(totaldist)
      }
    })

    return () => subscription.unsubscribe()
  }, [watchFIelds])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm font-bold">Cara bayar</p>
        <Combobox title="Nama Customer" items={custemers} onChange={(v) => setCurrentCust(v)} />
        <p className="text-sm">Metode</p>
        <div className="flex gap-4">
          <RadioGroup defaultValue="1" onValueChange={(v) => setMetode(parseInt(v))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="option-one" />
              <Label htmlFor="option-one">Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="option-two" />
              <Label htmlFor="option-two">Giro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="option-three" />
              <Label htmlFor="option-three">Transfer</Label>
            </div>
          </RadioGroup>
        </div>
        <InputForm title="Tanggal Pembayaran" type="datepicker" {...register("carabayar.tanggal")} />
        <InputForm title="Total" type="number" {...register("carabayar.total")} />
        {metode == 2 && (
          <div className="space-y-4">
            <InputForm type="text" title="Bank" {...register("carabayar.pembayaran.giro.bank")} />
            <InputForm
              type="text"
              title="Nomor Giro"
              {...register("carabayar.pembayaran.giro.nomor")}
            />
            <InputForm
              type="datepicker"
              title="Jatuh Tempo"
              {...register("carabayar.pembayaran.giro.jatuhTempo")}
            />
          </div>
        )}
        {metode == 3 && (
          <div>
            <InputForm
              type="text"
              title="Bank"
              {...register("carabayar.pembayaran.transfer.bank")}
            />
          </div>
        )}
        <div>
          <p className="text-sm font-bold">Distribusi</p>
          {
             distribusiFields.map((d, idx) => (
              <div className="flex gap-4 border-t-2 mt-2 items-end">
                <InputForm
                  {...register(`distribusi.${idx}.penagihanId`)}
                  type="combobox"
                  title="Penagihan"
                  options={penagihanOption}
                />
                <InputForm
                  {...register(`distribusi.${idx}.total`)}
                  type="number"
                  title="Jumlah"
                />
                <Button className={(idx == 0 ? "invisible" : "")} variant="outline" onClick={() => {if(idx) remove(idx)}} ><Trash /></Button>
              </div>
             ))
          }
          <Button className="mt-2" variant="outline" onClick={() => addDistribusiField()} ><PlusIcon /></Button>
        </div>
        <Button disabled={totalDistribusi != totalCarabayar} type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function CreatePembayaranModal() {
  const [open, setOpen] = useState(false);
  return (
    <Modal modalTitle="Create Pembayaran" open={open} onOpenChange={setOpen} buttonTitle="Create Pembayaran">
      <CreatePembayaranForm setOpen={setOpen} />
    </Modal>
  );
}

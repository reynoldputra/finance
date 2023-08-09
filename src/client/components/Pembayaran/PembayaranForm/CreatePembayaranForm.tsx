import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import Modal from "@client/components/modal/Modal";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
  createPembayaranWithCarabayarInput,
  TCreatePembayaranInput,
} from "@server/collections/pembayaran/pembayaranSchema";
import { Fragment, useEffect, useState } from "react";
import { dmyDate } from "@client/lib/dmyDate";
import { Combobox } from "@client/components/form/Combobox";
import { RadioGroup, RadioGroupItem } from "@client/components/ui/radio-group";
import { Label } from "@client/components/ui/label";
import { PlusIcon, RefreshCwIcon, Trash } from "lucide-react";
import { idr } from "@client/lib/idr";
import DefaultInput from "@client/components/form/InputForm/inputs/DefaultInput";
import ComboboxInput from "@client/components/form/InputForm/inputs/ComboboxInput";
import { Checkbox } from "@client/components/ui/checkbox";
import { cn } from "@client/lib/cn";

interface ModalFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IDistribusi {
  penagihanId: string;
  total: number;
  sisa: number;
  manualInput: boolean;
}

export function CreatePembayaranForm({ setOpen }: ModalFormProps) {
  const { toast } = useToast();
  const [penagihanOption, setPenagihanOption] = useState<ComboboxItem[]>();
  const [currCust, setCurrentCust] = useState("");
  const [metode, setMetode] = useState(1);
  const [totalCarabayar, setTotalcarabayar] = useState(0);
  const [totalDistribusi, setTotalDistirbusi] = useState(0);
  const [distribusi, setDistribusi] = useState<IDistribusi[]>([]);

  const c = [4, 3, 1, 3, 1].map((v) => "col-span-" + v.toString()); // class for form cols

  const penagihan = trpc.penagihan.getAllPenagihan.useQuery();
  const penagihanData = penagihan.data?.data ?? [];

  const form = useForm<TCreatePembayaranInput>({
    resolver: zodResolver(createPembayaranWithCarabayarInput),
    defaultValues: {
      distribusi: [{ penagihanId: "", total: 0 }],
      carabayar: {
        pembayaran: {},
        tanggal: new Date(),
      },
    },
  });

  const res = trpc.customer.customerOption.useQuery();
  const result = res.data ?? [];
  const custemers: ComboboxItem[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  useEffect(() => {
    const filteredPenagihan = penagihanData.filter(
      (p) => p.customerId == currCust && p.status == "WAITING"
    );

    const sortedPenagihan = filteredPenagihan.sort((a, b) => b.sisa - a.sisa);

    const penagihanItems: ComboboxItem[] = sortedPenagihan.map((p) => {
      const date = dmyDate(p.tanggalTagihan);
      return {
        title: `${p.transaksiId} ${date} ${idr(p.sisa)}`,
        value: p.id,
      };
    });

    setPenagihanOption(penagihanItems);
  }, [currCust]);

  const createPembayaranMutation = trpc.pembayaran.createPembayaran.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreatePembayaranInput) {
    try {
      console.log("submited");
      console.log("submited");
      console.log("submited");
      console.log("submited");
      console.log("submited");
      console.log("submited");
      // const { data } = await createPembayaranMutation.mutateAsync(values);
      // if (data?.distribusiHasil && data?.distribusiHasil.length > 0) {
      //   toast({
      //     variant: "success",
      //     className: "text-white text-base font-semibold",
      //     description: `${data.distribusiHasil.length} invoice terbayar`,
      //   });
      //   setOpen(false);
      //   utils.carabayar.invalidate();
      //   utils.penagihan.invalidate();
      // }
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

  const {
    fields: distribusiFields,
    append,
    remove,
  } = useFieldArray({
    name: "distribusi",
    control: form.control,
  });

  const addDistribusiField = () => {
    append({ penagihanId: "", total: 0 });
  };

  const watchDistribusi = form.watch(["distribusi"]);
  const watchCarabayarTotal = form.watch(["carabayar.total"]);

  const useWatchCarabayarTotal = useWatch({
    control: form.control,
    name: "carabayar.total",
  });

  const useWatchDistribusi = useWatch({
    control: form.control,
    name: "distribusi",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.carabayar?.total) setTotalcarabayar(value.carabayar?.total);
      if (value.distribusi) {
        const dist = value.distribusi.map((d, idx) => {
          const penagihan = penagihanData.find((p) => p.id == d?.penagihanId);
          const sisa = penagihan ? penagihan.sisa : 0;
          return {
            penagihanId: d?.penagihanId ?? "",
            total: d?.total ?? 0,
            sisa: sisa ?? 0,
            manualInput: distribusi[idx] ? distribusi[idx].manualInput : false,
          };
        });
        if (dist) setDistribusi(dist);
        let totaldist = 0;
        for (let idx in value.distribusi) {
          let valnumber = value.distribusi[idx]?.total ?? 0;
          let valstr = valnumber.toString();
          totaldist += parseInt(valstr);
        }
        setTotalDistirbusi(totaldist);
      }
    });

    return () => subscription.unsubscribe();
  }, [watchDistribusi, watchCarabayarTotal]);

  useEffect(() => {
    const dist = watchDistribusi[0];
    let totalPembayaran = useWatchCarabayarTotal;
    for (let idx in dist) {
      const p = dist[idx];
      if (p.penagihanId) {
        if (totalPembayaran > 0) {
          const sisa = distribusi[idx].sisa;
          if (sisa < totalPembayaran) {
            form.setValue(`distribusi.${parseInt(idx)}.total`, sisa);
            totalPembayaran -= sisa;
          } else {
            form.setValue(`distribusi.${parseInt(idx)}.total`, totalPembayaran);
            totalPembayaran = 0;
          }
        } else {
          form.setValue(`distribusi.${parseInt(idx)}.total`, 0);
        }
      }
    }
  }, [useWatchCarabayarTotal]);

  const onPenagihanChange = (id: string) => {
    const distribusiForm = form.getValues("distribusi");
    for (let idx in distribusiForm) {
      if (distribusiForm[idx].penagihanId == id) {
        const penagihan = penagihanData.find((p) => p.id == id);
        if (penagihan) {
          let sisa =
            totalCarabayar - totalDistribusi - penagihan.sisa > 0
              ? penagihan.sisa
              : totalCarabayar - totalDistribusi;
          sisa = sisa < 0 ? 0 : sisa;
          form.setValue(`distribusi.${parseInt(idx)}.total`, sisa);
        }
      }
    }
  };

  const onJumlahDistChange = () => {
    let totalPembayaran = useWatchCarabayarTotal;
    const formdistribusi = form.getValues("distribusi")
    for (let idx in formdistribusi) {
      const curDist = formdistribusi[idx];
      const distState = distribusi[idx];
      if (distState.manualInput) {
        totalPembayaran -= curDist.total
      } else {
        if (distState.sisa < totalPembayaran) {
          form.setValue(`distribusi.${parseInt(idx)}.total`, distState.sisa);
          totalPembayaran -= distState.sisa;
        } else {
          form.setValue(`distribusi.${parseInt(idx)}.total`, totalPembayaran < 0 ? 0 : totalPembayaran);
          totalPembayaran = 0;
        }
      }
    }
  };
  
  const autoFillHandle = () => {

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-base font-bold">Cara bayar</p>
        <div className="space-y-2">
          <Combobox title="Nama Customer" items={custemers} onChange={(v) => setCurrentCust(v)} />
        </div>
        <div>
          <p className="text-base mb-2">Metode</p>
          <div className="flex gap-2">
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
        </div>
        <InputForm
          title="Tanggal Pembayaran"
          type="datepicker"
          {...register("carabayar.tanggal")}
        />
        <div className="w-60">
          <InputForm title="Total" type="number" {...register("carabayar.total")} />
        </div>
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
          <p className="text-base font-bold">Distribusi</p>
          <Button variant="secondary" className="my-2 flex gap-2">
            <RefreshCwIcon className="w-5 h-5" /> <p>Auto Fill</p>
          </Button>
          <div className="grid grid-cols-12 gap-y-2 gap-x-2">
            <p className={c[0]}>Penagihan</p>
            <p className={c[1]}>Jumlah</p>
            <p className={cn("text-center", c[2])}>M</p>
            <p className={c[3]}>Sisa</p>
            <p className={c[4]}></p>
            {distribusiFields.map((field, idx) => (
              <Fragment key={idx}>
                <div className={c[0]}>
                  <ComboboxInput
                    width={200}
                    name={`distribusi.${idx}.penagihanId`}
                    onChange={(v) => onPenagihanChange(v)}
                    options={(() => {
                      if (penagihanOption) {
                        const result = penagihanOption.filter((p) => {
                          return (
                            !distribusi.find((d) => d.penagihanId == p.value) ||
                            p.value == distribusi[idx]?.penagihanId
                          );
                        });
                        return result;
                      } else {
                        return [];
                      }
                    })()}
                  />
                </div>
                <div className={c[1]}>
                  <DefaultInput
                    name={`distribusi.${idx}.total`}
                    onChange={(value) => {
                      onJumlahDistChange();
                    }}
                    type="number"
                    className="w-36"
                    disabled={distribusi[idx] && !distribusi[idx].manualInput}
                  />
                </div>
                <div className={cn("flex justify-center items-center", c[2])}>
                  <Checkbox
                    onCheckedChange={(v) => {
                      const currentDist = [...distribusi];
                      if (currentDist[idx]) {
                        if (v == false) {
                          currentDist[idx].manualInput = false;
                          const dist = form.getValues('distribusi');
                          let totalPembayaran = form.getValues('carabayar.total');
                          for (let idx in dist) {
                            const p = dist[idx];
                            if (p.penagihanId) {
                              if (totalPembayaran > 0) {
                                const sisa = distribusi[idx].sisa;
                                if (sisa < totalPembayaran) {
                                  form.setValue(`distribusi.${parseInt(idx)}.total`, sisa);
                                  totalPembayaran -= sisa;
                                  const newDistState = [...distribusi]
                                  newDistState[idx].total = sisa
                                  setDistribusi(newDistState)
                                } else {
                                  form.setValue(
                                    `distribusi.${parseInt(idx)}.total`,
                                    totalPembayaran
                                  );
                                  const newDistState = [...distribusi]
                                  newDistState[idx].total = totalPembayaran
                                  setDistribusi(newDistState)
                                  totalPembayaran = 0;
                                }
                              } else {
                                form.setValue(`distribusi.${parseInt(idx)}.total`, 0);
                              }
                            }
                          }
                        } else {
                          currentDist[idx].manualInput = true;
                        }
                        setDistribusi(currentDist);
                      }
                    }}
                  />
                </div>
                <div className={cn(c[3], "flex items-center")}>
                  {idr(distribusi[idx] ? distribusi[idx].sisa - distribusi[idx].total : 0)}
                </div>
                <div className={cn("flex justify-center", c[4])}>
                  <Button
                    className={cn("w-10 p-0", idx == 0 ? "invisible" : "")}
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      if (idx) remove(idx);
                      const dist = distribusi;
                      dist.splice(idx);
                      setDistribusi(dist);
                      let totaldist = 0;
                      for (let idx in distribusi) {
                        let valnumber = distribusi[idx]?.total ?? 0;
                        let valstr = valnumber.toString();
                        totaldist += parseInt(valstr);
                      }
                      setTotalDistirbusi(totaldist);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </Fragment>
            ))}
          </div>
          <Button type="button" className="mt-2" variant="outline" onClick={() => addDistribusiField()}>
            <PlusIcon />
          </Button>
        </div>
        <div className="w-full flex justify-center text-sm text-slate-600">
          <p>
            {totalCarabayar
              ? totalDistribusi - totalCarabayar > 0
                ? "Uang pembayaran sisa " + idr(totalDistribusi - totalCarabayar)
                : "Uang pembayaran kurang " + idr(totalCarabayar - totalDistribusi)
              : ""}
          </p>
        </div>
        <Button disabled={totalDistribusi != totalCarabayar} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function CreatePembayaranModal() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      modalTitle="Create Pembayaran"
      open={open}
      onOpenChange={setOpen}
      buttonTitle="Create Pembayaran"
    >
      <CreatePembayaranForm setOpen={setOpen} />
    </Modal>
  );
}

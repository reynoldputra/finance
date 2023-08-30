import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
    TUpdateDistribusi,
  TUpdatePembayaranInput,
  updatePemabayaranWithCarabayarInput,
} from "@server/collections/pembayaran/pembayaranSchema";
import { Fragment, useEffect, useState } from "react";
import { dmyDate } from "@client/lib/dmyDate";
import { RadioGroup, RadioGroupItem } from "@client/components/ui/radio-group";
import { Label } from "@client/components/ui/label";
import { PlusIcon, RefreshCwIcon, Trash, X } from "lucide-react";
import { idr } from "@client/lib/idr";
import DefaultInput from "@client/components/form/InputForm/inputs/DefaultInput";
import ComboboxInput from "@client/components/form/InputForm/inputs/ComboboxInput";
import { Checkbox } from "@client/components/ui/checkbox";
import { cn } from "@client/lib/cn";
import { Textarea } from "@client/components/ui/textarea";
import { TUpdateCaraBayarInput } from "@server/collections/caraBayar/caraBayarSchema";

interface IDistribusi {
  penagihanId: string;
  total: number;
  sisa: number;
  manualInput: boolean;
}

interface IDistribusiLama {
  penagihanId: string;
  distribusiId: string;
  total: number;
  sisa: number;
  manualInput: boolean;
  deleted: boolean;
}

interface IDetailMetodePembayaran {
  id: number;
  batasAtas: number;
  batasBawah: number;
}

interface ModalFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carabayarId: string;
}

export function UpdatePembayaranForm({ setOpen, carabayarId }: ModalFormProps) {
  const { toast } = useToast();
  const [penagihanBaruOption, setPenagihanBaruOption] = useState<ComboboxItem[]>([]);
  const [penagihanLamaOption, setPenagihanLamaOption] = useState<ComboboxItem[]>([]);
  const [currCust, setCurrentCust] = useState("");
  const [metode, setMetode] = useState(1);
  const [totalCarabayar, setTotalcarabayar] = useState(0);
  const [totalDistribusi, setTotalDistirbusi] = useState(0);
  const [distribusiLama, setDistribusiLama] = useState<IDistribusiLama[]>([]);
  const [distribusiBaru, setDistribusiBaru] = useState<IDistribusi[]>([]);
  const [detailMetode, setDetailMetode] = useState<IDetailMetodePembayaran[]>([]);

  const c = [4, 3, 1, 3, 1].map((v) => "col-span-" + v.toString()); // class for form cols

  const penagihan = trpc.penagihan.getAllPenagihan.useQuery();
  const penagihanData = penagihan.data?.data ?? [];

  const metodePembayaranQuery = trpc.pembayaran.getMetodePembayaran.useQuery();
  const metodePembayaranData = metodePembayaranQuery.data?.data;

  const form = useForm<TUpdatePembayaranInput>({
    resolver: zodResolver(updatePemabayaranWithCarabayarInput),
    defaultValues: {
      carabayar: {
        pembayaran: {},
      },
    },
  });

  const userForm = useForm<{ userId: string }>();

  const res = trpc.customer.customerOption.useQuery();
  const result = res.data ?? [];
  const custemers: ComboboxItem[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const register = form.register;

  const distribusiLamaFields = useFieldArray({
    name: "distribusiLama",
    control: form.control,
  });

  const distribusiBaruFields = useFieldArray({
    name: "distribusiBaru",
    control: form.control,
  });

  const watchDistribusi = form.watch(["distribusiLama", "distribusiBaru"]);
  const watchDistribusiBaru = form.watch("distribusiBaru");
  const watchCarabayarTotal = form.watch(["carabayar.total"]);

  const useWatchCarabayarTotal = useWatch({
    control: form.control,
    name: "carabayar.total",
  });

  // get metode pembayaran
  useEffect(() => {
    if (metodePembayaranData) {
      const detail: IDetailMetodePembayaran[] = [];

      for (let idx in metodePembayaranData) {
        const m = metodePembayaranData[idx];
        detail[m.id] = {
          id: m.id,
          batasBawah: m.batasBawah,
          batasAtas: m.batasAtas,
        };
      }

      setDetailMetode(detail);
    }
  }, [metodePembayaranQuery.status]);

  // query penagihan option baru when customer state changed
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

    setPenagihanBaruOption(penagihanItems);
  }, [currCust]);

  const updatePembayaranMutation = trpc.pembayaran.updatePembayaran.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TUpdatePembayaranInput) {
    try {
      console.log("submit", values)
      const { data } = await updatePembayaranMutation.mutateAsync(values);
      if (data) {
        toast({
          variant: "success",
          className: "text-white text-base font-semibold",
          description: `Berhasil update permbayaran`,
        });
        setOpen(false);
        utils.carabayar.invalidate();
        utils.penagihan.invalidate();
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

  const addDistribusiFieldBaru = () => {
    distribusiBaruFields.append({ penagihanId: "", total: 0 });
  };

  // create distribusi object for saving sisa and total
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.carabayar?.total) setTotalcarabayar(value.carabayar?.total);
      let totaldist = 0;
      if (value.distribusiLama) {
        for(let idx in value.distribusiLama){
          const distlama = value.distribusiLama[idx]
          if(distlama?.total) totaldist += distlama.total
        }
      }

      if (value.distribusiBaru) {
        const dist = value.distribusiBaru.map((d, idx) => {
          const penagihan = penagihanData.find((p) => p.id == d?.penagihanId);
          const sisa = penagihan ? penagihan.sisa : 0;
          return {
            penagihanId: d?.penagihanId ?? "",
            total: d?.total ?? 0,
            sisa: sisa ?? 0,
            manualInput: distribusiBaru[idx] ? distribusiBaru[idx].manualInput : false,
          };
        });
        if (dist) setDistribusiBaru(dist);
        for (let idx in value.distribusiBaru) {
          let valnumber = value.distribusiBaru[idx]?.total ?? 0;
          let valstr = valnumber.toString();
          totaldist += parseInt(valstr);
        }
      }

      setTotalDistirbusi(totaldist);
    });

    return () => subscription.unsubscribe();
  }, [watchDistribusi, watchCarabayarTotal]);

  // auto change jumlah distribusi baru when penagihan changed
  // need to tested
  const onPenagihanChange = (id: string) => {
    const distribusiForm = form.getValues("distribusiBaru");
    for (let idx in distribusiForm) {
      if (distribusiForm[idx].penagihanId == id) {
        const penagihan = penagihanData.find((p) => p.id == id);
        if (penagihan) {
          let sisa =
            totalCarabayar - totalDistribusi - penagihan.sisa > 0
              ? penagihan.sisa
              : totalCarabayar - totalDistribusi;
          sisa = sisa < 0 ? 0 : sisa;
          form.setValue(`distribusiLama.${parseInt(idx)}.total`, sisa);
        }
      }
    }
  };

  // when jumlah distribusi is changed manually, re-calculate distribusi for all auto fill penagihan 
  const onJumlahDistChange = () => {
    let totalPembayaran = useWatchCarabayarTotal;
    const formdistribusiLama = form.getValues("distribusiLama");
    for (let idx in formdistribusiLama) {
      const curDist = formdistribusiLama[idx];
      const distState = distribusiLama[idx];
      if (distState.manualInput) {
        totalPembayaran -= curDist.total;
      } else {
        if (distState.sisa < totalPembayaran) {
          form.setValue(`distribusiLama.${parseInt(idx)}.total`, distState.sisa);
          totalPembayaran -= distState.sisa;
        } else {
          form.setValue(
            `distribusiLama.${parseInt(idx)}.total`,
            totalPembayaran < 0 ? 0 : totalPembayaran
          );
          totalPembayaran = 0;
        }
      }
    }

    const formdistribusiBaru = form.getValues("distribusiBaru");
    for (let idx in formdistribusiBaru) {
      const curDist = formdistribusiBaru[idx];
      const distState = distribusiBaru[idx];
      if (distState.manualInput) {
        totalPembayaran -= curDist.total;
      } else {
        if (distState.sisa < totalPembayaran) {
          form.setValue(`distribusiBaru.${parseInt(idx)}.total`, distState.sisa);
          totalPembayaran -= distState.sisa;
        } else {
          form.setValue(
            `distribusiBaru.${parseInt(idx)}.total`,
            totalPembayaran < 0 ? 0 : totalPembayaran
          );
          totalPembayaran = 0;
        }
      }
    }
  };

  // onldy autfill for new distribusi
  const autoFillHandle = () => {
    let totalPembayaran = watchCarabayarTotal[0];
    distribusiLamaFields.remove()
    const newDistLamaState = [...distribusiLama]
    const newDistLamaForm : TUpdateDistribusi[] = []
    let countDistribusi = 0
    for(let idx in distribusiLama) {
      const distLamaState = distribusiLama[idx]
      let total = 0
      if(distLamaState.deleted) {
        newDistLamaState[idx].total = 0
      } else {
        if(totalPembayaran > distLamaState.sisa) {
          total = distLamaState.sisa
          totalPembayaran -= total
        } else {
          if (totalPembayaran == 0 ) newDistLamaState[idx].deleted = true
          total = totalPembayaran
          totalPembayaran = 0
        }
      }

      if (!newDistLamaState[idx].deleted) {
        newDistLamaForm.push({
          distribusiId : distLamaState.distribusiId,
          total : parseInt(total.toString())
        })
      }
      countDistribusi += total
      newDistLamaState[idx].total = total
    }
    setDistribusiLama(newDistLamaState)

    const filteredPenagihan = penagihanData.filter(
      (p) => p.customerId == currCust && p.status == "WAITING"
    );

    const sortedPenagihan = filteredPenagihan.sort((a, b) => b.sisa - a.sisa);
    form.setValue("distribusiBaru", []);

    const formFieldsValue: { penagihanId: string; total: number }[] = [];
    const newDistState: IDistribusi[] = [];


    for (let idx in sortedPenagihan) {
      if (totalPembayaran > 0) {
        const penagihan = sortedPenagihan[idx];
        let total = 0;
        if (penagihan.sisa < totalPembayaran) total = penagihan.sisa;
        else total = totalPembayaran;

        totalPembayaran -= total;

        formFieldsValue.push({
          penagihanId: penagihan.id,
          total,
        });

        countDistribusi += total

        newDistState.push({
          penagihanId: penagihan.id ?? "",
          total: total ?? 0,
          sisa: penagihan.sisa ?? 0,
          manualInput: false,
        });
      }
    }

    setTotalDistirbusi(totalDistribusi);
    setDistribusiBaru(newDistState);
    distribusiBaruFields.replace(formFieldsValue);

    console.log(newDistLamaForm)
    form.setValue("distribusiLama", newDistLamaForm);
  };

  const oldValueQuery = trpc.pembayaran.getPembayaranLama.useQuery(carabayarId)

  useEffect(() => {
    if(oldValueQuery.data?.data) {
      const oldValueData = oldValueQuery.data.data
      const result = oldValueData.result
      if(oldValueData.customerId) {
        userForm.setValue("userId", oldValueData.customerId)
        setCurrentCust(oldValueData.customerId)
      }

      if(result) {
        const carabayar : TUpdateCaraBayarInput = {
          id: result.id,
          total: Number(result.total),
          tandaTerima: result.tandaTerima,
          tanggal : result.tanggal,
          keterangan : result.keterangan ?? ""
        }

        if(result.giro) {
          carabayar.pembayaran = {
            giro : result.giro
          }
          setMetode(2)
        }
        if(result.transfer){
          setMetode(3)
          carabayar.pembayaran = {
            transfer : result.transfer
          }
        }
        
        form.setValue("carabayar", carabayar)

        const distLama : TUpdateDistribusi[] = []
        const penLamaOption : ComboboxItem[] = []
        const distLamaState : IDistribusiLama[] = []
        for(let idx in result.distribusiPembayaran) {
          const dist = result.distribusiPembayaran[idx]
          distLama.push({
            distribusiId : dist.id,
            total : Number(dist.jumlah)
          })


          const p = penagihanData.find(p => p.id == dist.penagihanId)
          if(p) {
            const date = dmyDate(p.tanggalTagihan)
            penLamaOption.push({
              value : dist.id,
              title: `${p.transaksiId} ${date} ${idr(p.sisa + Number(dist.jumlah))}`,
            })

            distLamaState.push({
              distribusiId : dist.id,
              total : Number(dist.jumlah),
              penagihanId : dist.penagihanId,
              deleted : false,
              sisa: p.sisa + Number(dist.jumlah),
              manualInput: false
            })
          }
        }
        
        setPenagihanLamaOption(penLamaOption)
        form.setValue("distribusiLama", distLama)
        setDistribusiLama(distLamaState)
      }
    }
  }, [oldValueQuery.status, penagihan.status])

  const recountDistribusi = () => {
    let totaldist = 0;
    for (let idx in distribusiLama) {
      if(!distribusiLama[idx].deleted) {
        let valnumber = distribusiLama[idx]?.total ?? 0;
        let valstr = valnumber.toString();
        totaldist += parseInt(valstr);
      }
    }
    for (let idx in distribusiBaru) {
      let valnumber = distribusiBaru[idx]?.total ?? 0;
      let valstr = valnumber.toString();
      totaldist += parseInt(valstr);
    }
    setTotalDistirbusi(totaldist);
  }

  return (
    <>
      <p className="text-base font-bold">Cara bayar</p>
      <Form {...userForm}>
        <div className="space-y-2">
          <ComboboxInput
            {...userForm.register("userId")}
            width={300}
            title="Nama Customer"
            options={custemers}
            onChange={(v) => setCurrentCust(v)}
            disabled={true}
          />
        </div>
      </Form>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <DefaultInput onChange={(v) => {console.log(v)}} title="Total" type="number" name="carabayar.total" />
          </div>
          {metode == 2 && (
            <div className="space-y-4 w-60">
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
            <div className="w-60">
              <InputForm
                type="text"
                title="Bank"
                {...register("carabayar.pembayaran.transfer.bank")}
              />
            </div>
          )}
          <div className="px-1 space-y-2">
            <p>Keterangan (opsional)</p>
            <Textarea {...register("carabayar.keterangan")} />
          </div>
          <div>
            <p className="text-base font-bold">Distribusi</p>
            <Button
              variant="secondary"
              className="my-2 flex gap-2"
              type="button"
              disabled={!(watchCarabayarTotal[0] && currCust)}
              onClick={() => autoFillHandle()}
            >
              <RefreshCwIcon className="w-5 h-5" /> <p>Auto Fill</p>
            </Button>
            <div className="grid grid-cols-12 gap-y-2 gap-x-2 mt-2">
              <p className={cn(c[0], "py-1 px-2 border rounded-md")}>Penagihan</p>
              <p className={cn(c[1], "py-1 px-2 border rounded-md")}>Jumlah</p>
              <p className={cn("text-center py-1 px-2 border rounded-md", c[2])}>M</p>
              <p className={cn(c[3], "py-1 px-2 border rounded-md")}>Sisa</p>
              <p className={cn(c[4])}></p>
              <p className={"py-1 px-2 border rounded-md col-span-12 text-center"}>Distribusi Lama</p>
              {distribusiLama.map((field, idx) => (
                <Fragment key={idx}>
                  <div className={c[0]}>
                    <div className="hidden">
                      <ComboboxInput
                        width={200}
                        disabled={true}
                        name=""
                        value={distribusiLama[idx] && distribusiLama[idx].penagihanId}
                        options={penagihanLamaOption}
                      />
                    </div>
                    <p className="text-sm text-center">{penagihanLamaOption.find(p => p.value == field.distribusiId)?.title}</p>
                  </div>
                  <div className={c[1]}>
                    <DefaultInput
                      value={distribusiLama[idx].total}
                      onChange={(v) => {
                        const distLamaState = [...distribusiLama]
                        distLamaState[idx].total = parseInt(v.toString())
                        setDistribusiLama(distLamaState)
                      }}
                      name=""
                      type="number"
                      className="w-36"
                      disabled={distribusiLama[idx] && !distribusiLama[idx].manualInput}
                    />
                  </div>
                  <div className={cn("flex justify-center items-center", c[2])}>
                    <Checkbox
                      onCheckedChange={(v) => {
                        const currentDist = [...distribusiLama];
                        const distLama = distribusiLama[idx];
                        const idxDistLamaState = distribusiLama.findIndex(d => d.distribusiId == distLama.distribusiId)
                        if (currentDist[idx]) {
                          if (v == false) {
                            currentDist[idx].manualInput = false;
                            let totalPembayaran = form.getValues("carabayar.total");

                            //fill distribusi lama
                            const distLama = distribusiLama.filter(d => d.deleted == false);
                            for (let idx in distLama) {
                              const distLamaForm = distLama[idx]
                              const idxDistLamaState = distribusiLama.findIndex(d => d.distribusiId == distLamaForm.distribusiId)
                              if(idxDistLamaState && !distribusiLama[idxDistLamaState].deleted) {
                                if (totalPembayaran > 0) {
                                  const sisa = distribusiLama[idx].sisa;
                                  if (sisa < totalPembayaran) {
                                    totalPembayaran -= sisa;
                                    const newDistState = [...distribusiLama];
                                    newDistState[idx].total = sisa;
                                    setDistribusiLama(newDistState);
                                  } else {
                                    currentDist[idxDistLamaState].total = totalPembayaran;
                                    totalPembayaran = 0;
                                  }
                                } else {
                                  currentDist[idxDistLamaState].total = 0;
                                }
                              }
                            }
                            setDistribusiLama(currentDist)

                            //fill distribusi baru
                            const dist = form.getValues("distribusiBaru");
                            for (let idx in dist) {
                              const p = dist[idx];
                              if (p.penagihanId) {
                                if (totalPembayaran > 0) {
                                  const sisa = distribusiBaru[idx].sisa;
                                  if (sisa < totalPembayaran) {
                                    form.setValue(`distribusiBaru.${parseInt(idx)}.total`, sisa);
                                    totalPembayaran -= sisa;
                                    const newDistState = [...distribusiBaru];
                                    newDistState[idx].total = sisa;
                                    setDistribusiBaru(newDistState);
                                  } else {
                                    form.setValue(
                                      `distribusiBaru.${parseInt(idx)}.total`,
                                      totalPembayaran
                                    );
                                    const newDistState = [...distribusiBaru];
                                    newDistState[idx].total = totalPembayaran;
                                    setDistribusiBaru(newDistState);
                                    totalPembayaran = 0;
                                  }
                                } else {
                                  form.setValue(`distribusiBaru.${parseInt(idx)}.total`, 0);
                                }
                              }
                            }
                          } else {
                            currentDist[idxDistLamaState].manualInput = true;
                          }
                          setDistribusiLama(currentDist);
                        }
                      }}
                    />
                  </div>
                  <div className={cn(c[3], "flex items-center")}>
                    {idr(distribusiLama[idx] ? distribusiLama[idx].sisa - distribusiLama[idx].total : 0)}
                  </div>
                  <div className={cn("flex justify-center", c[4])}>
                    <div
                      onClick={() => {
                        const idxdist = idx
                        const newDistState = [...distribusiLama]
                        const deleteVal = distribusiLama[idxdist]?.deleted
                        newDistState[idxdist].deleted = !deleteVal
                        setDistribusiLama(newDistState)
                        recountDistribusi()
                      }}
                      className={cn(
                      "cursor-pointer flex justify-center items-center rounded w-8 h-8 ",
                      distribusiLama[idx]?.deleted ? "bg-red-400" : ""
                    )}>
                      <Trash className={cn(
                        "text-red-400",
                        distribusiLama[idx]?.deleted ? "text-white" : ""
                      )} />
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-y-2 gap-x-2 mt-2">
              <p className={"py-1 px-2 border rounded-md col-span-12 text-center"}>Distribusi Baru</p>
              {watchDistribusiBaru && watchDistribusiBaru.map((field, idx) => (
                <Fragment key={idx}>
                  <div className={c[0]}>
                    <ComboboxInput
                      width={200}
                      name={`distribusiBaru.${idx}.penagihanId`}
                      onChange={(v) => onPenagihanChange(v)}
                      options={(() => {
                        if (penagihanBaruOption) {
                          const result = penagihanBaruOption.filter((p) => {
                            return (
                              !distribusiBaru.find((d) => d.penagihanId == p.value) ||
                              p.value == distribusiBaru[idx]?.penagihanId
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
                      name={`distribusiBaru.${idx}.total`}
                      onChange={(_) => {
                        onJumlahDistChange();
                      }}
                      type="number"
                      className="w-36"
                      disabled={distribusiBaru[idx] && !distribusiBaru[idx].manualInput}
                    />
                  </div>
                  <div className={cn("flex justify-center items-center", c[2])}>
                    <Checkbox
                      onCheckedChange={(v) => {
                        const currentDist = [...distribusiBaru];
                        if (currentDist[idx]) {
                          if (v == false) {
                            currentDist[idx].manualInput = false;
                            let totalPembayaran = form.getValues("carabayar.total");
                            //fill distribusi lama
                            const distLama = form.getValues("distribusiLama");
                            for (let idx in distLama) {
                              const distLamaForm = distLama[idx]
                              const idxDistLamaState = distribusiLama.findIndex(d => d.distribusiId == distLamaForm.distribusiId)
                              if(idxDistLamaState && !distribusiLama[idxDistLamaState].deleted) {
                                if (totalPembayaran > 0) {
                                  const sisa = distribusiLama[idx].sisa;
                                  if (sisa < totalPembayaran) {
                                    form.setValue(`distribusiLama.${parseInt(idx)}.total`, sisa);
                                    totalPembayaran -= sisa;
                                    const newDistState = [...distribusiLama];
                                    newDistState[idx].total = sisa;
                                    setDistribusiLama(newDistState);
                                  } else {
                                    form.setValue(
                                      `distribusiLama.${parseInt(idx)}.total`,
                                      totalPembayaran
                                    );
                                    const newDistState = [...distribusiLama];
                                    newDistState[idxDistLamaState].total = totalPembayaran;
                                    setDistribusiBaru(newDistState);
                                    totalPembayaran = 0;
                                  }
                                } else {
                                  form.setValue(`distribusiLama.${parseInt(idx)}.total`, 0);
                                }
                              }
                            }

                            //fill distribusi baru
                            const dist = form.getValues("distribusiBaru");
                            for (let idx in dist) {
                              const p = dist[idx];
                              if (p.penagihanId) {
                                if (totalPembayaran > 0) {
                                  const sisa = distribusiBaru[idx].sisa;
                                  if (sisa < totalPembayaran) {
                                    form.setValue(`distribusiBaru.${parseInt(idx)}.total`, sisa);
                                    totalPembayaran -= sisa;
                                    const newDistState = [...distribusiBaru];
                                    newDistState[idx].total = sisa;
                                    setDistribusiBaru(newDistState);
                                  } else {
                                    form.setValue(
                                      `distribusiBaru.${parseInt(idx)}.total`,
                                      totalPembayaran
                                    );
                                    const newDistState = [...distribusiBaru];
                                    newDistState[idx].total = totalPembayaran;
                                    setDistribusiBaru(newDistState);
                                    totalPembayaran = 0;
                                  }
                                } else {
                                  form.setValue(`distribusiBaru.${parseInt(idx)}.total`, 0);
                                }
                              }
                            }
                          } else {
                            currentDist[idx].manualInput = true;
                          }
                          setDistribusiBaru(currentDist);
                        }
                      }}
                    />
                  </div>
                  <div className={cn(c[3], "flex items-center")}>
                    {idr(distribusiBaru[idx] ? distribusiBaru[idx].sisa - distribusiBaru[idx].total : 0)}
                  </div>
                  <div className={cn("flex justify-center", c[4])}>
                    <Button
                      className={cn("w-10 p-0")}
                      variant="outline"
                      type="button"
                      onClick={() => {
                        distribusiBaruFields.remove(idx);
                        const dist = distribusiBaru;
                        dist.splice(idx);
                        setDistribusiBaru(dist);
                        recountDistribusi()
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                </Fragment>
              ))}
            </div>
            <Button
              type="button"
              className="mt-2"
              variant="outline"
              disabled={!(useWatchCarabayarTotal && currCust)}
              onClick={() => addDistribusiFieldBaru()}
            >
              <PlusIcon />
            </Button>
          </div>
          <div className="w-full flex flex-col items-center text-base text-slate-600">
            <p>Total distribusi : Rp {idr(totalDistribusi)}</p>
            <p>
              {detailMetode.length > 0 && totalCarabayar && totalCarabayar - totalDistribusi != 0
                ? totalDistribusi - totalCarabayar > 0
                  ? 
                    "Uang pembayaran kurang " + idr(totalDistribusi - totalCarabayar)
                  : 
                    "Uang pembayaran sisa " + idr(totalCarabayar - totalDistribusi)
                : ""}
            </p>
          </div>
          <Button
            onClick={() => {
              console.log(form.getValues())
              console.log(form.formState.errors)
            }}
            disabled={
              detailMetode.length > 0
                ? !(
                    totalDistribusi - totalCarabayar < detailMetode[metode].batasAtas &&
                    totalCarabayar - totalDistribusi < detailMetode[metode].batasBawah
                  )
                : true
            }
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

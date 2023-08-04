import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import {
  createPembayaranInput,
  TCreatePembayaranInput,
} from "@client/../server/collections/pembayaran/pembayaranSchema";
import { Row } from "@tanstack/react-table";
import { TPenagihanTable } from "../PenagihanTable/data/schema";

interface ModalFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<TPenagihanTable>;
}

export function CreatePembayaran({ setOpen, row }: ModalFormProps) {
  const { toast } = useToast();

  const form = useForm<TCreatePembayaranInput>({
    resolver: zodResolver(createPembayaranInput),
    defaultValues: {
      penagihanId: row.original.id,
      caraBayarLama: [{
        id : "",
        totalDistribusi: 0
      }],
    },
  });

  const res = trpc.carabayar.getCarabayar.useQuery();
  const result = res.data?.data ?? [];
  const carabayarOption: ComboboxItem[] = result.map((item) => ({
    title: `${item.metode.jenis} - ${item.id}`,
    value: item.id,
  }));

  const kolektor = trpc.kolektor.getAllKolektor.useQuery();
  const kolektorData = kolektor.data?.data ?? [];
  const kolektorOptions: ComboboxItem[] = kolektorData.map((k) => ({
    title: k.nama,
    value: k.id,
  }));

  const createPembayaranMutation = trpc.pembayaran.createPembayaran.useMutation();
  const utils = trpc.useContext();

  async function onSubmit(values: TCreatePembayaranInput) {
    try {
      const { data } = await createPembayaranMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Penagihan successfully created`,
        });
        setOpen(false);
        utils.penagihan.invalidate();
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  }

  const { fields, append } = useFieldArray({
    name: "caraBayarLama",
    control: form.control,
  });

  const addNewField = () => {
    append({
      id: "",
      totalDistribusi: 0,
    });
  };

  const register = form.register;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((f, idx) => {
          return (
            <>
              <hr/>
              <InputForm
                {...register(`caraBayarLama.${idx}.id`)}
                type="combobox"
                title="Pembayaran"
                options={carabayarOption}
              />
              <InputForm
                {...register(`caraBayarLama.${idx}.totalDistribusi`)}
                type="text"
                title="Distribusi"
              />
            </>
          );
        })}
        <div onClick={addNewField}>Add</div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

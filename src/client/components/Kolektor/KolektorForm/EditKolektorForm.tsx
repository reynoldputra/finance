import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import { trpc } from "@client/lib/trpc";
import {
  TUpdateKolektorInput,
  updateKolektorInput,
} from "@server/collections/kolektor/kolektorSchema";
import { useToast } from "@client/components/ui/use-toast";

interface kolektorData {
  id: string;
  name: string;
}

interface EditKolektorProps {
  kolektorData: kolektorData;
}

export default function EditKolektorForm({ kolektorData }: EditKolektorProps) {
  const { toast } = useToast();

  const form = useForm<TUpdateKolektorInput>({
    resolver: zodResolver(updateKolektorInput),
    defaultValues: {
      nama: kolektorData.name,
      id: kolektorData.id,
    },
  });

  const updateKolektorMutation = trpc.kolektor.updateKolektor.useMutation();

  async function onSubmit(values: TUpdateKolektorInput) {
    try {
      const { data } = await updateKolektorMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Kolektor ${data.nama} successfully edited`,
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          name="id"
          type="text"
          title="ID Kolektor"
          description="Edit ID Kolektor Here"
        />
        <InputForm
          name="nama"
          type="text"
          title="Nama Kolektor"
          description="Edit Nama Kolektor Here"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

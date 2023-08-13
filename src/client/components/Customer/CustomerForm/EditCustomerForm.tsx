import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import InputForm from "../../form/InputForm/InputForm";
import {
  TUpdateCustomerInput,
  updateCustomerInput,
} from "@server/collections/customer/customerSchema";
import { trpc } from "@client/lib/trpc";
import { useToast } from "@client/components/ui/use-toast";

interface Option {
  title: string;
  value: string;
}

interface customerData {
  id: string;
  nama: string;
  kolektorId: string;
  alamat?: string;
}

interface EditCustomerProps {
  customerData: customerData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditCustomerForm({
  customerData,
  setOpen,
}: EditCustomerProps) {
  const { toast } = useToast();

  const form = useForm<TUpdateCustomerInput>({
    resolver: zodResolver(updateCustomerInput),
    defaultValues: {
      nama: customerData.nama,
      id: customerData.id,
      kolektorId: customerData.kolektorId,
      alamat: customerData.alamat ? customerData.alamat : "",
    },
  });

  const data = trpc.kolektor.getAllKolektor.useQuery();
  const result = data.data?.data ?? [];
  const kolektors: Option[] = result.map((item) => ({
    title: item.nama,
    value: item.id,
  }));

  const utils = trpc.useContext();
  const updateCustumerMutation = trpc.customer.updateCustomer.useMutation({
    onSuccess: () => {
      utils.customer.invalidate();
    },
  });

  async function onSubmit(values: TUpdateCustomerInput) {
    try {
      const { data } = await updateCustumerMutation.mutateAsync(values);
      if (data) {
        toast({
          description: `Customer ${data.nama} successfully edited`,
          variant: "success",
          className: "text-white text-base font-semibold",
        });
        setOpen(false);
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
      toast({
        description: `Failed to update customer, please try again`,
        variant: "destructive",
        className: "text-white text-base font-semibold",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          name="id"
          type="text"
          title="ID Customer"
          description="Edit ID Customer Here"
        />
        <InputForm
          name="nama"
          type="text"
          title="Nama Customer"
          description="Edit Nama Customer Here"
        />
        <InputForm
          name="alamat"
          type="text"
          title="Alamat Customer"
          description="Edit Alamat Customer Here"
        />
        <InputForm
          name="kolektorId"
          type="combobox"
          title="Nama Kolektor"
          description="Change Nama Kolektor Here"
          options={kolektors}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

import InvoiceTable from "./InvoiceTable/InvoiceTable";
import Sidebar from "../Sidebar";
import CreateInvoice from "./CreateInvoice";

export default function Invoice() {
  return (
    <>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Sidebar />
      </div>
      <div className="w-full flex justify-end">
        <CreateInvoice />
      </div>
      <InvoiceTable />
    </>
  );
}

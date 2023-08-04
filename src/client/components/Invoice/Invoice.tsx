import InvoiceTable from "./InvoiceTable/InvoiceTable";
import Sidebar from "../Sidebar";

export default function Invoice() {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-y-4 mt-4">
        <Sidebar />
        <h1 className="font-bold text-2xl mx-auto">Invoice Table</h1>
      </div>
      <InvoiceTable />
    </>
  );
}

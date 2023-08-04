import InvoiceTable from "./InvoiceTable/InvoiceTable";
import Sidebar from "../Sidebar";

export default function Invoice() {
  return (
    <>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Sidebar />
      </div>
      <InvoiceTable />
    </>
  );
}

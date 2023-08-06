import InvoiceTable from "./InvoiceTable/InvoiceTable";

export default function Invoice() {
  return (
    <div className="w-full min-h-screen flex-col overflow-x-hidden flex justify-center items-center gap-y-4 py-5">
      <h1 className="font-bold text-2xl text-darkBlue font mx-auto">
        Invoice Table
      </h1>
      <div className="bg-white rounded-xl xl:w-10/12 w-8/12 sm:w-9/12 border-2 drop-shadow-2xl">
        <InvoiceTable />
      </div>
    </div>
  );
}

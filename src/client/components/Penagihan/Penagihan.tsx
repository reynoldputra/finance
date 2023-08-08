import PenagihanTable from "./PenagihanTable";

export default function Penagihan() {
  return (
    <>
      <div className="w-full min-h-screen flex-col flex justify-center items-center gap-y-4 py-5">
        <h1 className="font-bold text-2xl text-darkBlue font mx-auto">Penagihan Table</h1>
        <div className="bg-white rounded-xl xl:w-10/12 w-8/12 sm:w-9/12 border-2 drop-shadow-2xl">
          <PenagihanTable />
        </div>
      </div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import KolektorTable from "./KolektorTable";
import { Toaster } from "../ui/toaster";
import Sidebar from "../Sidebar";

export default function Kolektor() {
  return (
    <div>
      <div className="w-full flex-col flex justify-center items-center gap-y-4 mt-4">
        <Sidebar />
        <h1 className="font-bold text-2xl mx-auto">Kolektor Table</h1>
      </div>
      <KolektorTable />
    </div>
  );
}

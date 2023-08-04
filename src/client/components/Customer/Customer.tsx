import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import { Toaster } from "../ui/toaster";
import Sidebar from "../Sidebar";

export default function Customer() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center gap-y-4 mt-4">
        <Sidebar />
        <h1 className="font-bold text-2xl mx-auto">Customer Table</h1>
      </div>
      <CustomerTable />
    </div>
  );
}

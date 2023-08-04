import { useNavigate } from "react-router-dom";
import KolektorTable from "./KolektorTable";
import { Toaster } from "../ui/toaster";
import Sidebar from "../Sidebar";
import CreateKolektor from "./CreateKolektor";

export default function Kolektor() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Sidebar />
      </div>
      <p>Kolektor Page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <KolektorTable />
      <CreateKolektor />
      <Toaster />
    </div>
  );
}

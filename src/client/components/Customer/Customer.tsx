import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import { Toaster } from "../ui/toaster";
import Sidebar from "../Sidebar";
import CreateCustomer from "./CreateCustomer";

export default function Customer() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Sidebar />
      </div>
      <p>Customer page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <CustomerTable />
      <CreateCustomer />
      <Toaster />
    </div>
  );
}

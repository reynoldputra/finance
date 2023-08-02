import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import CreateCustomerForm from "./CustomerForm";
import { Toaster } from "../ui/toaster";

export default function Customer() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Customer page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <CustomerTable />
      <CreateCustomerForm />
      <Toaster />
    </div>
  );
}

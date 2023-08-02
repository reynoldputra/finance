import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";

export default function Customer() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Customer page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <CustomerTable />
      <CustomerForm />
    </div>
  );
}

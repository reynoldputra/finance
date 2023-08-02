import { useNavigate } from "react-router-dom";
import KolektorTable from "./KolektorTable";
import KolektorForm from "./KolektorForm";
import { Toaster } from "../ui/toaster";

export default function Kolektor() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Kolektor Page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <KolektorTable />
      <KolektorForm />
      <Toaster />
    </div>
  );
}

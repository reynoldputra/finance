import { useNavigate } from "react-router-dom";
import KolektorTable from "./KolektorTable";

export default function Kolektor() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Kolektor Page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <KolektorTable />
    </div>
  );
}
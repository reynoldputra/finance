import { useNavigate } from "react-router-dom"
import Table from "./Table"

export default function Customer () {
  const navigate = useNavigate()
  return (
    <div>
      <p>Customer page</p>
      <div onClick={() => navigate("/")}>Go to home page</div>
      <Table />
    </div>
  );
}

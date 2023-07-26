import { useNavigate } from "react-router-dom";

export default function Customer() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Customer page</p>
      <p onClick={() => navigate("/")}>back</p>
    </div>
  );
}

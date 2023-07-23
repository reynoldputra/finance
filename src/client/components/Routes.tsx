import { Router, Route } from "electron-router-dom";
import CustomerPage from "../pages/customer";
import HomePage from "../pages/home";

export function AppRoutes() {
  return (
    <div>
      <Router
        main={
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/customer" element={<CustomerPage />} />
          </>
        }
      />
    </div>
  );
}

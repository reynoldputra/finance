import { Router, Route } from "electron-router-dom";
import CustomerPage from "@client/pages/customer";
import HomePage from "@client/pages/home";
import KolektorPage from "@client/pages/kolektor";

export function AppRoutes() {
  return (
    <div>
      <Router
        main={
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/kolektor" element={<KolektorPage />} />
          </>
        }
      />
    </div>
  );
}

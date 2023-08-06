import { Router, Route } from "electron-router-dom";
import CustomerPage from "@client/pages/customer";
import HomePage from "@client/pages/home";
import KolektorPage from "@client/pages/kolektor";
import InvoicePage from "@client/pages/invoice";
import PenagihanPage from "@client/pages/penagihan";
import PembayaranPage from "@client/pages/pembayaran";

export function AppRoutes() {
  return (
    <div>
      <Router
        main={
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/kolektor" element={<KolektorPage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/penagihan" element={<PenagihanPage />} />
            <Route path="/pembayaran" element={<PembayaranPage />} />
          </>
        }
      />
    </div>
  );
}

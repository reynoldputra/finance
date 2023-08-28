import React from "react";
import ReportAccounting from "../report/reportAccounting";
import ReportIncomingBank from "../report/reportIncomingBank";
import ReportPenagihan from "../report/reportPenagihan";
import ReportSetoranBank from "../report/reportSetoranBank";
import ReportTableMaster from "../report/reportTableMaster";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  return (
    <div className="w-full min-h-screen flex flex-col p-10">
      <h1 className="font-bold text-3xl">Dashboard</h1>
      <ReportPenagihan />
      <ReportSetoranBank />
      <ReportAccounting />
      <ReportIncomingBank />
      <ReportTableMaster />
    </div>
  );
};

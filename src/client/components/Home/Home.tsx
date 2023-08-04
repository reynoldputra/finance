import React, { useEffect } from "react";
import Sidebar from "../Sidebar";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  // const info = `This app is using Chrome (v${window.appApi.chrome()}), Node.js (v${window.appApi.node()}), and Electron (v${window.appApi.electron()})`;
  return (
    <div className="p-10">
      <div className="w-full flex flex-col">
        <h1 className="font-bold text-xl mx-auto">Finance App</h1>
      </div>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Sidebar />
      </div>
      <div>
      </div>
    </div>
  );
};

import React, { useEffect } from "react";
import { ExampleForm } from "./ExampleForm";
import { Modal } from "../Modal";
import Sidebar from "../Sidebar";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  const info = `This app is using Chrome (v${window.appApi.chrome()}), Node.js (v${window.appApi.node()}), and Electron (v${window.appApi.electron()})`;

  useEffect(() => {
    window.appApi.receive("app", (event) => {
      console.log("Received event from main ", event);
      alert("Received event from main " + event.action);
    });
  }, []);

  return (
    <div className="p-10">
      <div className="w-full flex flex-col">
        <h1 className="font-bold text-xl mx-auto">Vite + React</h1>
        <div className="mx-auto">{info}</div>
      </div>
      <div className="w-full flex justify-center items-center gap-x-4 mt-4">
        <Modal
          buttonTitle="Ini Modal"
          modalTitle="Submitted"
          description="You submit the form"
          buttonVariant="outline"
        />
        <Sidebar />
      </div>
      <div className="px-64 mt-2">
        <ExampleForm />
      </div>
    </div>
  );
};

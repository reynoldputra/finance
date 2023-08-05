import { ReactNode } from "react";
import { Toaster } from "./ui/toaster";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen w-full max-h-full bg-normalBlue bg-opacity-10">
      <Sidebar />
      <Toaster />
      <main className="w-11/12 h-full">{children}</main>
    </div>
  );
}

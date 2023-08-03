import { ReactNode } from "react";
import { Toaster } from "./ui/toaster";

export default function Layout ({children} : {children : ReactNode}) {
  return (
    <>
      <Toaster />
      {children}
    </>
  ) 
}

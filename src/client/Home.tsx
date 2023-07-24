import React, { useEffect } from "react";
import { trpc } from "./util";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@client/components/ui/dialog";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  const info = `This app is using Chrome (v${window.appApi.chrome()}), Node.js (v${window.appApi.node()}), and Electron (v${window.appApi.electron()})`;

  const utils = trpc.useContext();
  // const users = trpc.users.useQuery();
  // const addUser = trpc.userCreate.useMutation({
  //   onSuccess: () => {
  //     utils.users.invalidate();
  //   }
  // });
  // const getAllTagihan = trpc.getAllTagihanByCustomerId.useQuery('clk4uf9r10000356k8qr4noyp ')
  // function getAllTagihan(customerId: string) {
  //   trpc.getAllTagihanByCustomerId.useQuery(customerId)
  // }

  useEffect(() => {
    window.appApi.receive("app", (event) => {
      console.log("Received event from main ", event);
      alert("Received event from main " + event.action);
    });
  }, []);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        {info}

        <h2>Users</h2>
        <Dialog>
          {/* button */}
          <DialogTrigger>Open</DialogTrigger>
          {/* modals */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <p>
          Edit <code>src/Home.tsx</code> and save to test HMR!
        </p>
      </div>
    </div>
  );
};
